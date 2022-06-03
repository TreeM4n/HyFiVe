import { query } from './jsquery.js';


// initialize the map
var map = L.map('map').setView([54.548698, 10.769660], 10);

// load a tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  {
    attribution: 'Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="http://mass.gov/mgis">MassGIS</a>',
    maxZoom: 21,
    minZoom: 4
  }).addTo(map);

// every n th element is drawn
var mult = 2;
// time difference before skip line draw
var distanceinminutes = 2

var diff = 0;
// Read markers data from data.csv
var datamap = [];

//console.log("map")

var blacklistmap = ["TSYTemperatrue", "MS5837Press", "time", "deployment", "MS5837Temperature",
  "MS5837Press", "Speed", "Course", "Latitude", "Oxygen", "Longitude"]

// format the data
var data_longmap = [];



export function mapfnc(dataquery) {

  // console.log(dataquery)

  dataquery.forEach(function (d) {
    //2022-05-12T07:28:47.000Z: delete Z and T and milliS
    d.time = d.time.split("T")[0] + " " + d.time.split("T")[1].split(".")[0]
    d.time = parseTime(d.time);
    d.TSYTemperatrue = +d.TSYTemperatrue;

    d.Oxygen = +d.Oxygen;
    d.MS5837Press = +d.MS5837Press;



    for (var prop in d) {
      var a = [prop];
      // console.log("por")
      if (a.some(r => blacklistmap.indexOf(r) >= 0)) { continue; }

      if (d.Latitude === null || d.Longitude === null) { continue; }
      data_longmap.push({
        time: d.time,
        Latitude: d.Latitude,
        Longitude: d.Longitude
      });

    }
    //cheat
    datamap = data_longmap;

  });

  //console.log(dataquery)

  // For each row in data, create a marker and add it to the map
  // For each row, columns `Latitude`, `Longitude`, and `Time` are required
  for (var i in datamap) {

    if (i % mult == 1) {
      //for markers instead of lines
      /*
      var marker = L.marker([row.Latitude, row.Longitude], {
          opacity: 1
      }).bindPopup(row.Time);

      marker.addTo(map);
      */



      if (i > 9) {
        diff = Math.abs(+datamap[i - mult].time - +datamap[i].time);
        //console.log(diff );
        if (diff < 60000 * distanceinminutes) {
          var lat1 = datamap[i].Latitude;
          var lat2 = datamap[i - mult].Latitude;
          var lon1 = datamap[i].Longitude;
          var lon2 = datamap[i - mult].Longitude;
          var pointA = new L.LatLng(lat1, lon1);
          var pointB = new L.LatLng(lat2, lon2);
          var pointList = [pointA, pointB];
          var line = new L.Polyline(pointList).bindPopup(datamap.time);
          line.addTo(map);
        }
      }
    }
    //console.log(data[i])
  }


}
