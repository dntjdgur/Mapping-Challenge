var myMap = L.map('map', {
    center: [42, -70],
    zoom: 3
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

d3.json(url, function(importeddata) {
    var features = importeddata.features;

    // console.log(features);


    for (var i = 0; i < features.length; i++) {

        properties = features[i].properties;

        // console.log(properties);

        geometry = features[i].geometry;

        mag = properties.mag;

        // console.log(mag);

        place = properties.place;
        coordinates = geometry.coordinates;

        // console.log(place);
        // console.log(coordinates);

        function markerSize(magnitude) {
            return magnitude*10000;
        }

        function getColor(magnitude) {
            return magnitude <= 1 ? 'GreenYellow':
                magnitude <= 2 ? 'Yellow':
                magnitude <= 3 ? 'PeachPuff':
                magnitude <= 4 ? 'Orange':
                magnitude <= 5 ? 'SandyBrown':
                'red';
        }

        L.circle([coordinates[1], coordinates[0]], {
            fillOpacity: 0.75,
            color: getColor(features[i].properties.mag),
            fillColor: getColor(features[i].properties.mag),
            radius: markerSize(features[i].properties.mag)
        }).bindPopup("<h1>" + place + "</h1> <hr> <h3>Magnitude: " + mag + "</h3>").addTo(myMap);

    }

    var legend = L.control({position: 'bottomright'});
        legend.onAdd = function(myMap) {
        var div = L.DomUtil.create('div', 'info legend');
        var labels = ['0-1', '1-2', '2-3', '3-4', '4-5', '+5'];
        var magnitude = [0, 1, 2, 3, 4, 5];
        div.innerHTML = '<div><b>Legend</b></div>'

        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(magnitude[i]) + '">&nbsp;&nbsp;</i>&nbsp;&nbsp' + labels[i] + (labels[i] ? '<br>' : '+');
            
        }

        return div;

    };

    legend.addTo(myMap);

});