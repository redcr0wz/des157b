(function() {
    'use strict';

    const button = document.querySelector('#switch');
    const body = document.querySelector('body');
    const footer = document.querySelector('footer');
    const sections = document.querySelectorAll('section')
    let mode = 'creation';

    button.addEventListener('click', function() {
        if (mode === 'creation') {
            body.className = 'switch';
            body.style.backgroundImage = "url('images/rest.gif')";
            footer.className = 'switch';
            button.className = 'switch';
            button.innerHTML = "rest.";
            for (const section of sections) {
                section.className = 'switch';
            }
            mode = 'rest';
        } else {
            body.removeAttribute('class');
            body.style.backgroundImage = "url('images/creation.gif')";
            footer.removeAttribute('class');
            button.removeAttribute('class');
            button.innerHTML = "CREATION.";
            for (const section of sections) {
                section.removeAttribute('class');
            }
            mode = 'creation';
        }
    })
})()