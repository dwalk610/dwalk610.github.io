// map object creation
var map = L.map("map", {
    center: [39.83, -98.58],
    zoom: 3
  });

// add tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

// define function to determine circle marker size based on earthquake level
function quakesize(magnitude) {
                return {
                  radius: magnitude * 5000000 ,
                  fillColor: "#ff7800",
                  color: "#000",
                  weight: 1,
                  opacity: 0.5,
                  fillOpacity: 0.8
                };
                        };

// define function to color earthquake location circles by magnitude
// thanks colorbrewer2.org for the awesome color schemes!
function quake_color(mag) {
    return mag > 5 ? '#a50f15' :
           mag > 4 ? '#de2d26' :
           mag > 3 ? '#fb6a4a' :
           mag > 2 ? '#fcae91' :
                     '#fee5d9' ;
}

// create legend which will use the same color patter as quake_color 
var legend = L.control({position:'topright'});

legend.onAdd = function (map) {
  
  var div = L.DomUtil.create('div', 'info legend'),
    mags = [0, 2, 3, 4, 5],
    labels = [];

  // loop through magnitude list to create colored square for each interval
  for (var i = 0; i < mags.length; i++) {
    div.innerHTML +=
        '<i style="background:' + quake_color(mags[i] + 1) + '"></i> ' +
        mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
}

return div;
};

legend.addTo(map);

// define onEach function to add popup with information on each datapoint in map
function onEachFeature(feature,layer) {
    layer.bindPopup("<h3>" + feature.properties.place + "<br>" + " - Magnitude" + feature.properties.mag +
        "</h3><hr><p>" + Date(feature.properties.time))
}

// link to geo json for all earthquakes in past 30 days with magnitude greater than 1.0
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson";

// fetch data from json
d3.json(link, function(data) {
    // create geojson layer from earthquake data
    L.geoJson(data , {

        // use pointToLater to define function which creates markers at each earthquake location 
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 1.5,
                fillColor: quake_color(feature.properties.mag), // wefewf
                color: "#000",
                weight: 1,
                opacity: 0.5,
                fillOpacity: 0.8
            });
        },

        // use onEach function to add popup to each circle
        onEachFeature: onEachFeature
    }).addTo(map);
});
