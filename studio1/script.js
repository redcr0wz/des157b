(function(){
    'use strict';
    
    // full screen
 
    const jazz = document.querySelector('#jazz');
    const fs = document.querySelector('.fa-expand');
 
    fs.addEventListener('click', function() {
        if(!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    // notes animation
 
    const notes = document.querySelectorAll('#music img');
    let i = 0;
    let showing = true;

    notes.forEach(function(note) { note.className = 'hidden'; });

    setInterval(function() {
        if (showing) {
            notes[i].className = 'showing';
        } else {
            notes[i].className = 'hidden';
        }

        i++;

        if (i >= notes.length) {
            i = 0;
            showing = !showing;
        }
    }, 400);

    // mute and unmute

    const staff = document.querySelector('#staff');

    staff.addEventListener('click', function() {
        jazz.muted = !jazz.muted;
    });
})();