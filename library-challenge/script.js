(function(){
    'use strict';

    // add your script here
    var map = L.map('map').setView([38.297539, -122.286865], 12);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var nvc = L.marker([38.2736, -122.2743]).addTo(map);
    var vintage = L.marker([38.3330506, -122.3039148]).addTo(map);
    var harvest = L.marker([38.29, -122.3]).addTo(map);

    nvc.bindPopup("<b>My Community College</b><br>I got an associates degree in Digital Art and Graphic Design.");
    vintage.bindPopup("<b>My High School</b><br>Lost my senior year to COVID.");
    harvest.bindPopup("<b>My Middle School</b><br>I had an animation class here. This used to be Harvest Middle School.");

    var granimInstance = new Granim({
        element: '#granim-canvas',
        name: 'granim',
        opacity: [1, 1],
        states : {
            "default-state": {
                gradients: [
                    ['#834D9B', '#D04ED6'],
                    ['#1CD8D2', '#93EDC7']
                ]
            }
        }
    });
}());