import * as config from './config.js';


// initialize the map
var map = L.map('map').setView([54.17939750000001, 12.081335], 10);
//console.log("map")
// load a tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  {
    attribution: 'Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="http://mass.gov/mgis">MassGIS</a>',
    maxZoom: 21,
    minZoom: 4
  }).addTo(map);

var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
var diff = 0;

  // Date parser
  var parseUTCDate = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");
  var getDate = function(d) {
    return parseUTCDate(d).setHours(0,0,0,0);
  };
// Read markers data from data.csv
var datamap = [1];

//console.log("map")

// format the data
var data_longmap = [];


export function mapfnc(dataquery) {

  // console.log(dataquery)
  //map.flyTo([54.548698, 20.769660], 10);
  dataquery.forEach(function (d) {
    //2022-05-12T07:28:47.000Z: delete Z and T and milliS
    d.time = d.time.split("T")[0] + " " + d.time.split("T")[1].split(".")[0]
    d.time = parseTime(d.time);

    //d.time = +d.time
    d.TSYTemperatrue = +d.TSYTemperatrue;
    d.Oxygen = +d.Oxygen;
    d.MS5837Press = +d.MS5837Press;
   //    console.log(d.time);


    for (var prop in d) {
      var a = [prop];
      // console.log("por")
      if (a.some(r => config.mapblacklistmap.indexOf(r) >= 0)) { continue; }

      if (d.Latitude === null || d.Longitude === null) { continue; }
      data_longmap.push({
        time: d.time,
        Latitude: d.Latitude,
        Longitude: d.Longitude,
        depl: d.deployment
      });

    }
    //cheat
    datamap = data_longmap;

  });

  //console.log(datamap)

  // For each row in data, create a marker and add it to the map
  // For each row, columns `Latitude`, `Longitude`, and `Time` are required
  map.setView([datamap[1].Latitude, datamap[1].Longitude], 13);
  //flyTo
  for (var i in datamap) {

    if (i % config.MapPoints == 1) {
      //for markers instead of lines
      /*
      var marker = L.marker([row.Latitude, row.Longitude], {
          opacity: 1
      }).bindPopup(row.Time);

      marker.addTo(map);
      */



      if (i > 9) {
        diff = Math.abs(+datamap[i - config.MapPoints].time - +datamap[i].time);
        //console.log(diff );
        if (diff < 60000 * config.MapDim) {
          var lat1 = datamap[i].Latitude;
          var lat2 = datamap[i - config.MapPoints].Latitude;
          var lon1 = datamap[i].Longitude;
          var lon2 = datamap[i - config.MapPoints].Longitude;
          var pointA = new L.LatLng(lat1, lon1);
          var pointB = new L.LatLng(lat2, lon2);
          var pointList = [pointA, pointB];
          var line = new L.Polyline(pointList).bindPopup("eh lmao");
          line.addTo(map);
        }
      }
    }
    //console.log(data[i])
  }


}

export function setmapview(data) {
    
    var dataFilter = datamap.filter(function (d) { return d.depl == data[0].depl })
    console.log(dataFilter)
  //L.flyTo([lat, lng] 10);
}