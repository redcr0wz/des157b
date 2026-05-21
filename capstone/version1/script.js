(function(){
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
            invert: false,
        },

        keyboard: {
            enabled: true,
            onlyInViewport: false,
        },
    });

    // REELS

    async function displayFriends() {
        const friends = Parse.Object.extend('Friends');
        const query = new Parse.Query(friends);
        const results = await query.ascending('lname').find();
        // console.log(results);

        results.forEach(function(eachFriend) {
            const id = eachFriend.id;
            const lname = eachFriend.get('lname');
            const fname = eachFriend.get('fname');
            const email = eachFriend.get('email');
            const facebook = eachFriend.get('facebook');
            const twitter = eachFriend.get('twitter');
            const instagram = eachFriend.get('instagram');
            const linkedin = eachFriend.get('linkedin');
            
            const theListItem = document.createElement("div");
            theListItem.setAttribute("id", `r-${id}`);
            theListItem.innerHTML = `
                <div class="name">
                        ${fname} ${lname}
                    </div>
                    <div class="email">
                        <i class="fas fa-envelope-square"></i> ${email}
                    </div>
                    <div class="social">
                        <a href="${facebook}"><i class="fab fa-facebook-square"></i></a>
                        <a href="${twitter}"><i class="fab fa-twitter-square"></i></a>
                        <a href="${instagram}"><i class="fab fa-instagram"></i></a>
                        <a href="${linkedin}"><i class="fab fa-linkedin"></i></a>
                    </div>
                    <i class="fas fa-edit" id="e-${id}"></i>
                    <i class="fas fa-times-circle" id="d-${id}"></i>
                `;

                friendList.append(theListItem);
        });
    }

    displayFriends();

    (async () => {
        const Friends = Parse.Object.extend('Friends');
        const query = new Parse.Query(Friends);
        // You can also query by using a parameter of an object 
        //query.equalTo('objectId', 'xKue915KBG');
        try {
            const results = await query.find();
            for (const object of results) {
                // Access the Parse Object attributes using the .GET method
                const lname = object.get('lname')
                const fname = object.get('fname') 
                const email = object.get('email')
                const facebook = object.get('facebook') 
                const twitter = object.get('twitter') 
                const instagram = object.get('instagram') 
                const linkedin = object.get('linkedin')
                console.log(lname);
                console.log(fname);
                console.log(email);
                console.log(facebook);
                console.log(twitter);
                console.log(instagram);
                console.log(linkedin);
            }
        } catch (error) {
            console.error('Error while fetching Friends', error);
        }
    })();

    document.querySelector('#home').addEventListener('click', function(){
        location.reload();
    }); 

    // back4app count function for hearts
    
}());