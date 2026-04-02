(function() {
    'use strict';

    const button = document.querySelector('#switch');
    const body = document.querySelector('body');
    const banner = document.querySelector('#banner');
    const footer = document.querySelector('footer p');
    const sections = document.querySelectorAll('section')
    let mode = 'creation';

    button.addEventListener('click', function() {
        if (mode === 'creation') {
            body.className = 'switch';
            footer.className = 'switch';
            button.className = 'switch';
            for (const section of sections) {
                section.className = 'switch';
            }
            mode = 'rest';
        } else {
            body.removeAttribute('class');
            footer.removeAttribute('class');
            button.removeAttribute('class');
            for (const section of sections) {
                section.removeAttribute('class');
            }
            mode = 'creation';
        }
    })
})()