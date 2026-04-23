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
        let html = '<option>CHOOSE A DATE</option>';
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

    function updateInterface(value, jsonData) {
        const tv = document.querySelector('#tv');
        const movies = jsonData[value].movies;
        const graphic = document.querySelector('#graphic');

        if (loopTimer) {
            clearTimeout(loopTimer);
        }

        if (movies.length == 0) {
            tv.innerHTML = `<p>None :(</p>`;
            graphic.src = 'images/pairgone.jpg'
            return;
        }

        let i = 0;

        function loop() {
            const movie = movies[i];
            graphic.src = 'images/pair.jpg'

            tv.innerHTML = `
                <p>${movie.title}</p>
                <img src="${movie.imgsrc}" alt="${movie.title}">
            `;

            i = (i + 1) % movies.length;

            loopTimer = setTimeout(loop, 3000); 
        }
        loop();
    }  

    getData();
})();