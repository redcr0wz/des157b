(function () {
    'use strict';
    
    // DATA
    let globalData;
    async function getData(){
        const dates = await fetch('data/data.json');
        const data = await dates.json();
        // console.log(data);
        globalData = data;
        document.querySelector('#tv').innerHTML = outputHTML(data);
        document.querySelector('#date').innerHTML = createSelectList(data);
    }

    // OUTPUT HTML
    function outputHTML(data) {
        let html = `<p>Choose a date!</p>`;
        // html += '<img src="images/static.jpg" alt="static">';
        return html;
    }

    // SELECT LIST
    function createSelectList(data) {
        let html = '<option value="" disabled selected>CHOOSE A DATE</option>';
        const dataDates = Object.keys(data);
        console.log(dataDates);
        dataDates.forEach(function(eachDate) {
            html += `<option value="${eachDate}">${data[eachDate].date}</option>`
        });

        return html;
    }

    // UPDATE INTERFACE
    document.querySelector('#date').addEventListener('change', function() {
        const newValue = this.value;
        updateInterface(newValue, globalData);
    });

    let loopTimer = null; 
    let staticTimer = null;

    function updateInterface(value, jsonData) {
        if (!jsonData[value]) {
            return;
        }

        const tv = document.querySelector('#tv');
        const movies = jsonData[value].movies;
        const graphic = document.querySelector('#graphic');

        if (loopTimer) {
            clearTimeout(loopTimer);
        }
        if (staticTimer) {
            clearTimeout(staticTimer);
        }

        if (!movies || movies.length === 0) {
            tv.innerHTML = `<p>None :(</p>`;
            graphic.src = 'images/nopair.gif';
            return;
        } 
        
        if (movies.length === 1) {
            const movie = movies[0];
            graphic.src = 'images/pair.gif';

            tv.innerHTML = `
                <p>${movie.title}</p>
                <img src="${movie.imgsrc}" alt="${movie.title}">
            `;
            return;
        }

        let i = 0;
        graphic.src = 'images/pair.gif';

        function loop() {
            const movie = movies[i];

            tv.innerHTML = `<img src="images/static.gif" alt="static">`;

            staticTimer = setTimeout(function () {
                tv.innerHTML = `
                    <p>${movie.title}</p>
                    <img src="${movie.imgsrc}" alt="${movie.title}">
                `;

                i = (i + 1) % movies.length;

                loopTimer = setTimeout(loop, 2500);
            }, 500);
        }
        loop();
    }

    getData();
})();