(function () {
    'use strict';
    console.log('reading JS');

    // BACK4APP
    Parse.initialize("Ig6Wg0sxRdWz1WNmCKGdHMvby6TRbpPkoN9QMfKD", "08K6nxOe7vkeUe3uvhLVUGb8NuNTWSYpTIj3gfSu");
    Parse.serverURL = "https://parseapi.back4app.com/";

    // SWIPERJS
    const swiper = new Swiper('.swiper', {
        direction: 'vertical',
        grabCursor: true,
        slideToClickedSlide: true,
        pagination: {
            el: '.swiper-pagination',
            type: "progressbar",
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        mousewheel: {
            invert: false
        },
        keyboard: {
            enabled: true,
            onlyInViewport: false
        },
    });

    // SLIDE IDS
    const slides = document.querySelectorAll('.swiper-slide');
    slides.forEach((slide, index) => {
        slide.dataset.slideId = `slide-${index + 1}`;
    });

    // LIKES
    const likeCache = {};
    const likedSlides = new Set(JSON.parse(localStorage.getItem('likedSlides') || '[]'));

    async function getOrCreateLikeObject(slideId) {
        if (likeCache[slideId]) return likeCache[slideId];
        const Likes = Parse.Object.extend('Likes');
        const query = new Parse.Query(Likes);
        query.equalTo('slideId', slideId);
        let obj = await query.first();
        if (!obj) {
            obj = new Likes();
            obj.set('slideId', slideId);
            obj.set('count', 0);
            await obj.save();
        }
        likeCache[slideId] = { obj, count: obj.get('count') };
        return likeCache[slideId];
    }

    async function loadLikesForSlide(slide) {
        const slideId = slide.dataset.slideId;
        const heartBtn = slide.querySelector('.heart-btn');
        const countEl = slide.querySelector('.like-count');
        if (!heartBtn || !countEl) return;
        try {
            const cached = await getOrCreateLikeObject(slideId);
            countEl.textContent = cached.count;
            if (likedSlides.has(slideId)) {
                heartBtn.classList.remove('unliked');
                heartBtn.classList.add('liked');
                heartBtn.querySelector('i').classList.replace('fa-regular', 'fa-solid');
            }
        } catch (err) {
            console.error('Error loading likes for', slideId, err);
        }
    }

    async function handleLike(slide) {
        const slideId = slide.dataset.slideId;
        const heartBtn = slide.querySelector('.heart-btn');
        const countEl = slide.querySelector('.like-count');
        if (!heartBtn || !countEl) return;
        const isLiked = likedSlides.has(slideId);
        try {
            const cached = await getOrCreateLikeObject(slideId);
            const newCount = Math.max(0, cached.count + (isLiked ? -1 : 1));
            cached.count = newCount;
            countEl.textContent = newCount;
            if (isLiked) {
                likedSlides.delete(slideId);
                heartBtn.classList.remove('liked');
                heartBtn.classList.add('unliked');
                heartBtn.querySelector('i').classList.replace('fa-solid', 'fa-regular');
            } else {
                likedSlides.add(slideId);
                heartBtn.classList.add('liked');
                heartBtn.classList.remove('unliked');
                heartBtn.querySelector('i').classList.replace('fa-regular', 'fa-solid');
                heartBtn.classList.add('pop');
                heartBtn.addEventListener('animationend', () => heartBtn.classList.remove('pop'), { once: true });
            }
            localStorage.setItem('likedSlides', JSON.stringify([...likedSlides]));
            cached.obj.set('count', newCount);
            await cached.obj.save();
        } catch (err) {
            console.error('Error saving like for', slideId, err);
        }
    }

    slides.forEach(slide => {
        const heartBtn = slide.querySelector('.heart-btn');
        if (heartBtn) {
            heartBtn.addEventListener('click', () => handleLike(slide));
            loadLikesForSlide(slide);
        }
    });

    // COMMENTS

    // Build the comment drawer and inject it into the page
    const drawer = document.createElement('div');
    drawer.id = 'comment-drawer';
    drawer.innerHTML = `
        <div id="comment-drawer-inner">
            <div id="comment-drawer-header">
                <span id="comment-drawer-title">Comments</span>
                <button id="comment-drawer-close"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div id="comment-list"></div>
            <div id="comment-input-row">
                <input id="comment-input" type="text" placeholder="Add a comment…" maxlength="300" />
                <button id="comment-submit"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    document.body.appendChild(drawer);

    let activeSlideId = null;

    function openCommentDrawer(slideId) {
        activeSlideId = slideId;
        drawer.classList.add('open');
        swiper.keyboard.disable();
        swiper.mousewheel.disable();
        loadComments(slideId);
        drawer.querySelector('#comment-input').focus();
    }

    function closeCommentDrawer() {
        drawer.classList.remove('open');
        activeSlideId = null;
        swiper.keyboard.enable();
        swiper.mousewheel.enable();
        drawer.querySelector('#comment-list').innerHTML = '';
        drawer.querySelector('#comment-input').value = '';
    }

    drawer.querySelector('#comment-drawer-close').addEventListener('click', closeCommentDrawer);

    // BACKDROP CLICK
    drawer.addEventListener('click', e => {
        if (e.target === drawer) closeCommentDrawer();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) closeCommentDrawer();
    });

    async function loadComments(slideId) {
        const list = drawer.querySelector('#comment-list');
        list.innerHTML = '<p class="comment-loading">Loading…</p>';

        try {
            const Comments = Parse.Object.extend('Comments');
            const query = new Parse.Query(Comments);
            query.equalTo('slideId', slideId);
            query.ascending('createdAt');
            const results = await query.find();

            list.innerHTML = '';
            if (results.length === 0) {
                list.innerHTML = '<p class="comment-empty">No comments yet. Be the first!</p>';
                return;
            }
            results.forEach(c => appendComment(c.get('text'), c.get('author') || 'anonymous', c.createdAt));
        } catch (err) {
            list.innerHTML = '<p class="comment-empty">Could not load comments.</p>';
            console.error(err);
        }
    }

    function appendComment(text, author, date) {
        const list = drawer.querySelector('#comment-list');
        const placeholder = list.querySelector('.comment-empty, .comment-loading');
        if (placeholder) placeholder.remove();

        const item = document.createElement('div');
        item.className = 'comment-item';
        const timeStr = date ? new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
        item.innerHTML = `
            <div class="comment-author">${escapeHtml(author)} <span class="comment-date">${timeStr}</span></div>
            <div class="comment-text">${escapeHtml(text)}</div>
        `;
        list.appendChild(item);
        list.scrollTop = list.scrollHeight;
    }

    async function submitComment() {
        const input = drawer.querySelector('#comment-input');
        const text = input.value.trim();
        if (!text || !activeSlideId) return;

        input.value = '';
        appendComment(text, 'you', new Date());
        updateCommentCount(activeSlideId, 1);

        try {
            const Comments = Parse.Object.extend('Comments');
            const c = new Comments();
            c.set('slideId', activeSlideId);
            c.set('text', text);
            c.set('author', 'anonymous');
            await c.save();
        } catch (err) {
            console.error('Error posting comment', err);
        }
    }

    drawer.querySelector('#comment-submit').addEventListener('click', submitComment);
    drawer.querySelector('#comment-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') submitComment();
    });

    // COMMENT COUNTING

    const commentCountCache = {};

    async function loadCommentCount(slide) {
        const slideId = slide.dataset.slideId;
        const countEl = slide.querySelector('.comment-count');
        if (!countEl) return;
        try {
            const Comments = Parse.Object.extend('Comments');
            const query = new Parse.Query(Comments);
            query.equalTo('slideId', slideId);
            const count = await query.count();
            commentCountCache[slideId] = count;
            countEl.textContent = count;
        } catch (err) {
            console.error('Error loading comment count', err);
        }
    }

    function updateCommentCount(slideId, delta) {
        const slide = [...slides].find(s => s.dataset.slideId === slideId);
        if (!slide) return;
        const countEl = slide.querySelector('.comment-count');
        if (!countEl) return;
        commentCountCache[slideId] = (commentCountCache[slideId] || 0) + delta;
        countEl.textContent = commentCountCache[slideId];
    }

    // COMMENT BUTTON LOADING
    slides.forEach(slide => {
        const commentBtn = slide.querySelector('.comment-btn');
        if (commentBtn) {
            commentBtn.addEventListener('click', () => openCommentDrawer(slide.dataset.slideId));
            loadCommentCount(slide);
        }
    });

    // HELPERS
    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // REFRESH
    document.querySelector('#home').addEventListener('click', () => location.reload());
    document.querySelector('#logo').addEventListener('click', () => location.reload());

    // MORE MODAL
    const modal = document.querySelector('#modal');
    const moreBtn = document.querySelector('#more');
    const closeBtn = document.querySelector('#closeBtn');

    function openModal() { modal.classList.add('show'); }
    function closeModal() { modal.classList.remove('show'); }

    moreBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    // PROFILE MODAL
    const profileModal = document.querySelector('#profile-modal');
    const profileBtn = document.querySelector('#profile');
    const profileCloseBtn = document.querySelector('.profile-modal-close');

    function openProfileModal() { profileModal.classList.add('show'); }
    function closeProfileModal() { profileModal.classList.remove('show'); }

    profileBtn.addEventListener('click', openProfileModal);
    profileCloseBtn.addEventListener('click', closeProfileModal);
    profileModal.addEventListener('click', e => { if (e.target === profileModal) closeProfileModal(); });

    // POST MODAL
    const postModal = document.querySelector('#post-modal');
    const postBtn = document.querySelector('#post');
    const postCloseBtn = document.querySelector('.post-modal-close');

    function openPostModal() { postModal.classList.add('show'); }
    function closePostModal() { postModal.classList.remove('show'); }

    postBtn.addEventListener('click', openPostModal);
    postCloseBtn.addEventListener('click', closePostModal);
    postModal.addEventListener('click', e => { if (e.target === postModal) closePostModal(); });

    // ACCOUNT MODAL
    const accountModal = document.querySelector('#account-modal');
    const accountBtns = document.querySelectorAll('.account'); 
    const accountCloseBtn = document.querySelector('.account-modal-close');

    function openAccountModal() { accountModal.classList.add('show'); }
    function closeAccountModal() { accountModal.classList.remove('show'); }

    accountBtns.forEach(btn => btn.addEventListener('click', openAccountModal)); 
    accountCloseBtn.addEventListener('click', closeAccountModal);
    accountModal.addEventListener('click', e => { if (e.target === accountModal) closeAccountModal(); });

    // SHARE MODAL
    const shareModal = document.querySelector('#share-modal');
    const shareBtns = document.querySelectorAll('.share'); 
    const shareCloseBtn = document.querySelector('.share-modal-close');

    function openShareModal() { shareModal.classList.add('show'); }
    function closeShareModal() { shareModal.classList.remove('show'); }

    shareBtns.forEach(btn => btn.addEventListener('click', openShareModal)); 
    shareCloseBtn.addEventListener('click', closeShareModal);
    shareModal.addEventListener('click', e => { if (e.target === shareModal) closeShareModal(); });

    // START MODAL
    const startModal = document.querySelector('#start-modal');
    const startCloseBtn = document.querySelector('.start-modal-close');
    function closeStartModal() { startModal.classList.remove('show'); }
    startCloseBtn.addEventListener('click', closeStartModal);
    startModal.addEventListener('click', e => { if (e.target === startModal) closeStartModal(); });
    startCloseBtn.addEventListener('click', startPostModal);

    // SHARED ESCAPE KEY HANDLER (consolidated)
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeModal();
            closeProfileModal();
            closePostModal();
            closeAccountModal();
            closeShareModal();
            closeStartModal();
        }
    });

}());