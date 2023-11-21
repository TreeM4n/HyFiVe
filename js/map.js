import * as config from './config.js';




/*
split int 3 parts

1. initiate map and get assets
2. format data
3. draw lines on map based on data

*/

// -------------------------------------------- PART 1 ----------------------------

var startIcon = L.icon({
  iconUrl: './assets/marker-start.png',
  iconSize: [64, 64], // size of the icon
  iconAnchor: [32, 64], // point of the icon which will correspond to marker's location 
  popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var endIcon = L.icon({
  iconUrl: './assets/marker-end.png',
  iconSize: [64, 64], // size of the icon
  iconAnchor: [32, 64], // point of the icon which will correspond to marker's location 
  popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});




var map = L.map('map', {
  preferCanvas: true
}).setView([54.17939750000001, 12.081335], 9);
// OLD MAP Function
/* 

// function so an online and offline map exists
var online = navigator.onLine;
//comment line below to use better map
online = false;

if (online) {

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    {
      attribution: 'Tiles by <a href="http://mapc.org">MAPC</a>',
      maxZoom: 21,
      minZoom: 4
    }).addTo(map);

}
if (online) {

  var myGeoJSONPath = './assets/custom.geo.json';
  var myCustomStyle = {
    stroke: false,
    fill: true,
    fillColor: 'green',
    fillOpacity: 1
  }
  $.getJSON(myGeoJSONPath, function (data) {


    L.geoJson(data, {
      clickable: false,
      style: myCustomStyle,
      attribution: 'Tiles by <a href="https://www.naturalearthdata.com/">NaturalEarth</a>',
      maxZoom: 21,
      minZoom: 4
    }).addTo(map);

  })


}



L.tileLayer.mbTiles('../assets/Layer.mbtiles', {
  maxZoom: 21,
  minZoom: 4
}).addTo(map);
*/


L.tileLayer("../assets/OSM-baltic/{z}/{x}/{y}.png", {
  maxZoom: 15,
  minZoom: 3,
  //attribution: 'Tiles by <a href="www.4umaps.com">OpenStreetMaps</a>',
  attribution: 'Tiles by OpenSeaMaps and 4UMaps',
  tileSize: 512,
  zoomOffset: -1
}).addTo(map);

//---------------------------------------------------------- PART 2 ---------------------------------------------------
// parse time
var parseTime = d3.utcParse("%Y-%m-%dT%H:%M:%SZ");
var diff = 0;

// Read markers data from data.csv
var datamap;

//console.log("map")

// format the data
var data_longmap = [];
var rows = ["latitude", "longitude", "deployment_id", "time"]
var line
var formatTime2 = d3.timeFormat("%Y-%m-%d %H:%M");
var parseTime2 = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");

export async function mapfnc() {
  data_longmap = []
  //map.removeLayer(line)
  var dataquery = sessionStorage.getItem("response")
  dataquery = JSON.parse(dataquery)
  //console.log(dataquery)
  if (dataquery) {
    dataquery.forEach(function (d) {
      //2022-05-12T07:28:47.000Z: delete Z and T and milliS
      //d.time = d.time.split("T")[0] + " " + d.time.split("T")[1].split("Z")[0]
      d.time = parseTime(d.time);
      for (var prop in d) {
        //if (a.some(r => config.mapblacklistmap.indexOf(r) >= 0)) { continue; }
        if (rows.includes(prop)) { } else { continue; }
        if (d.latitude < -90 || d.longitude < -180 || d.latitude > 90 || d.longitude > 180 ) {continue;}


        data_longmap.push({
          time: d.time,
          Latitude: d.latitude,
          Longitude: d.longitude,
          depl: d.deployment_id
        });

      }

      datamap = data_longmap;

    });
  }

  //console.log(datamap)
  // --------------------------------------------------- PART 3 --------------------------------------------------------------
  // focus map on first coordinate
  try {
    map.setView([datamap[1].Latitude, datamap[1].Longitude]);
  } catch (error) {

  }

  //flyTo
  for (var i in datamap) {

    if (i % config.MapPoints == 1) {
      /*
      //function to generate random color / useful to color e.g different tracks
      var color;
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      color = "rgb(" + r + " ," + g + "," + b + ")";
      */
      if (i > 1 + config.MapPoints) {
        var lat1 = datamap[i].Latitude;
        var lat2 = datamap[i - config.MapPoints].Latitude;
        var lon1 = datamap[i].Longitude;
        var lon2 = datamap[i - config.MapPoints].Longitude;
        var pointA = new L.LatLng(lat1, lon1);
        var pointB = new L.LatLng(lat2, lon2);
        var pointList = [pointA, pointB];
        line = new L.Polyline(pointList, {
          color: "rgb(0,0,0)", // set color 
          weight: 5,
          smoothFactor: 1
        })
          .bindPopup("Time:" + (formatTime2(parseTime2(datamap[i].time))));
        line.addTo(map);
      }
    }
    //console.log(data[i])
  }



}


// fucntion to call to set the start and end marker on the map
var markerStart = {};
var markerEnd = {};
var markerPosition = {};
export function setmapview(data) {
  try {
    var dataFilter = datamap.filter(function (d) { return d.depl == data[0].depl })
    //console.log(dataFilter)

    map.flyTo([dataFilter[0].Latitude, dataFilter[0].Longitude]);

    if (markerEnd != undefined) {
      map.removeLayer(markerStart);
      map.removeLayer(markerEnd);
    };

    markerStart = L.marker([dataFilter[0].Latitude, dataFilter[0].Longitude], {
      icon: startIcon,
      opacity: 1,
      color: 'red'
    }).bindPopup("Downcast Position").addTo(map);


    markerStart.addTo(map);
    markerEnd = L.marker([dataFilter[dataFilter.length - 1].Latitude, dataFilter[dataFilter.length - 1].Longitude], {
      icon: endIcon,
      opacity: 1,
      color: 'red'
    }).bindPopup("Upcast Position").addTo(map);




    //Add a marker to show where you clicked.
    //theMarker = L.marker([dataFilter[0].Latitude, dataFilter[0].Longitude]).addTo(map); 
  } catch (error) {

  }

}
//remove markers
export function removemapview() {
  if (markerEnd != undefined) {
    //map.removeLayer(line)
    map.removeLayer(markerStart);
    map.removeLayer(markerEnd);
  };
}

export async function clearMap() {
  for(var i in map._layers) {
      if(map._layers[i]._path != undefined) {
          try {
            map.removeLayer(map._layers[i]);
          }
          catch(e) {
              console.log("problem with " + e + map._layers[i]);
          }
      }
  }
}
/*
//export function to set marker on click location in charts || unimplemented
export function showpoint(time) {
  var formatTime = d3.timeFormat("%Y-%m-%d %H:%M");
  var dataFilter = datamap.filter(function (d) { return formatTime(d.time) == formatTime(time) })
  // console.log(dataFilter)

  if (dataFilter.length != 0 && dataFilter) {
    //console.log(dataFilter)
    map.flyTo([dataFilter[0].Latitude, dataFilter[0].Longitude]);

    if (markerPosition != undefined) {
      map.removeLayer(markerPosition);

    };
    markerPosition = L.marker([dataFilter[0].Latitude, dataFilter[0].Longitude], {
      icon: startIcon,
      opacity: 1,
      color: 'red'
    }).bindPopup("Latitude:  " + dataFilter[0].Latitude + "<br> Longitude: " + dataFilter[0].Longitude).addTo(map);
  }

}
*/