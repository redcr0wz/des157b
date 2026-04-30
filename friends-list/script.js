// JS here
(function (){
    'use strict';
    console.log('reading JS');

    Parse.initialize("posGh3TAMAV52Nq4TGk4IwpG04ahowD03cQ8nP0d", "hDd37qWlIUVKHIEutGg7cUUpsMOjeEX5TD3Uqarx"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
    Parse.serverURL = "https://parseapi.back4app.com/";

    const newBtn = document.querySelector("#newbtn");
    const editBtns = document.querySelectorAll(".fa-edit");
    const addFriendForm = document.querySelector("#add-friend");
    const editFriendForm = document.querySelector("#edit-friend");
    const friendList = document.querySelector("main ol")

    newBtn.addEventListener("click", function(event){
        event.preventDefault();
        addFriendForm.className = 'add-friend-onscreen';
    });

    addFriendForm.addEventListener("click", function(event){
        event.preventDefault();
        addFriendForm.className = 'add-friend-offscreen';
    });

    for (let i = 0; i < editBtns.length; i++) {
        editBtns[i].addEventListener('click', function(event) {
            event.preventDefault();
            editFriendForm.className = "edit-friend-onscreen";
        })
    }

    editFriendForm.addEventListener("click", function(event){
        event.preventDefault();
        editFriendForm.className = 'edit-friend-offscreen';
    });

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
            
            const theListItem = document.createElement("li");
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

})();

