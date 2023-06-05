import * as mapJS from './map.js';
import * as chartJS from './chartmultilegend.js';
import * as config from './config.js';

//#!./node_modules/.bin/esr
/* eslint-disable @typescript-eslint/no-unused-vars */
//////////////////////////////////////////
// Shows how to use InfluxDB query API. //
//////////////////////////////////////////
import { InfluxDB, Point, flux } from '../node_modules/@influxdata/influxdb-client-browser/dist/index.browser.mjs'


//import {InfluxDB, flux, fluxDuration} from '../@influxdata/influxdb-client'
import {
  url,
  token,
  org,
  bucket,
  username,
  password,
} from '../env.mjs'




//48 h zuerst
// get from and to date and convert them to query useable format
export function query() {
  var formatData = d3.timeFormat("%Y-%m-%dT%H:%M:%SZ");

  var end = new Date(document.getElementById('field2').value)
  end = formatData(end)

  var start = new Date(document.getElementById('field1').value)
  start = formatData(start)

  return jQuery.ajax({
    url: "./php/queryhyfive.php",    //the page containing php script
    type: 'POST',    //request type,
    dataType: 'json',
    data: { start: start, end: end },
    complete: function (data) {

    }
    //,
    /*success: function result(result) {
      console.log(result);

     
     
    }*/
  })

  //return dataquery;
};

//48 h zuerst
// get from and to date and convert them to query useable format
export function JSquery() {
  // console.log('hi')
  var formatData = d3.timeFormat("%Y-%m-%dT%H:%M:%SZ");

  var end = new Date(document.getElementById('field2').value)
  end = formatData(end)

  var start = new Date(document.getElementById('field1').value)
  start = formatData(start)



  const fluxQuery = ' from(bucket:"hyfive") |> range(start: ' + start + ', stop:' + end + ' ) |> filter(fn: (r) => r._measurement == "CLUPEA")'
  const influxDB = new InfluxDB({ url, token })

  // There are more ways of how to receive results,
  // the essential ones are shown in functions below.
  // Execution of a particular function follows
  // its definition, comment/uncomment it at will.
  // See also rxjs-query.ts and queryWithParams.mjs .

  //console.log('\n*** QUERY ***')
  const queryApi = influxDB.getQueryApi(org)
  /* let result = {
      date:"",
      value: "",
      prop: ""

  }; */
  var result = [];
  //console.log(result)
  var index = 0;
  queryApi.queryRows(fluxQuery, {

    next(row, tableMeta) {
      const o = tableMeta.toObject(row)
      const data = { "time": o._time, "value": o._value, "prop": o._field };
      result.push(data)


      //result.push([o._time, o._value, o._field]);

      //console.log(result)
      /*
      if (o.example) {
        // custom output for example query
        console.log(
          `${o._time} ${o._measurement} in '${o.location}' (${o.example}): ${o._field}=${o._value}`
        )
      } else {
        // default output
        console.log(JSON.stringify(o, null, 2))
      }
      */
    },
    error(error) {
      console.log('QUERY FAILED', error)
    },
    complete() {

      return new Promise((resolve, reject) => {
        var data = [];

        var i = 0;

        var allGroup = d3.group(result, d => d.time)
        //console.log(allGroup)
        allGroup.forEach(element => {

          //if (a.some(r => config.mainblacklist.indexOf(r) >= 0)) { return; }
          var dataObject = {};
          //console.log(element)
          element.forEach(element2 => {
            var a = [element2.prop];
            //console.log(a)
            if (a.some(r => config.mainblacklist.indexOf(r) >= 0)) { return; }
            dataObject[element2.prop] = element2.value;
            dataObject.time = element2.time.toString();
          })
          data[i] = dataObject;
          //console.log(dataObject);
          i++;
          dataObject = {};
          //console.log(data)
        });
        //console.log(data)
        result = data;
        sessionStorage.setItem("response", JSON.stringify(result));
        //console.log(sessionStorage.getItem("response"))
        //return result;
        resolve(result)
      }, 0)
    }
    ,
  })

  //return o;
};



