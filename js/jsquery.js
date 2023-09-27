import * as config from './config.js';
import * as chartJS from './chartmultilegend.js';
import * as depthJS from './depthchart.js';
import * as mapJS from './map.js';

//#!./node_modules/.bin/esr
/* eslint-disable @typescript-eslint/no-unused-vars */
//////////////////////////////////////////
// Shows how to use InfluxDB query API. //
//////////////////////////////////////////
import { InfluxDB, Point, flux } from '../node_modules/@influxdata/influxdb-client-browser/dist/index.browser.mjs'

/*

{
    "url": "http:\/\/hyfive.info:8086",
    "token": "pD7hE8gVEAkEU2ewamqMCTNzoBOFuv3Qmyu6-awH5uaHhHc8ArgRgIkWGzFf_k0KYyVQ3XFIX7eed2uq27AdjQ==",
    "org": "HyFive",
    "bucket": "hyfive",
    "username": "hyfive",
    "password": "hyfive"
}

*/
//import {InfluxDB, flux, fluxDuration} from '../@influxdata/influxdb-client'
import {
  url,
  token,
  org,
  bucket,
  username,
  password,
  fetchSettings
} from '../env.mjs'

// Function to format date as required
function formatDate(date) {
  const formatData = d3.timeFormat("%Y-%m-%dT%H:%M:%SZ");
  return formatData(date);
}

// Function to perform the InfluxDB query
async function performQuery(start, end) {
  return new Promise(async (resolve, reject) => {
    // hyfive.inf0 = bucket:hyfive measurement. CLUPEA
    const fluxQuery = `from(bucket:"localhyfive") |> range(start: ${start}, stop: ${end}) |> filter(fn: (r) => r._measurement == "netcdf")`;
    const influxDB = new InfluxDB({ url, token });
    const queryApi = influxDB.getQueryApi(org);

    const result = [];

    try {
      await queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          const data = { "time": o._time, "value": o._value, "prop": o._field };
          result.push(data);
        },
        error(error) {
          console.log('QUERY FAILED', error);
          reject(error); // Reject the promise on error
        },
        complete() {
          resolve(result); // Resolve the promise when the query is complete
        }
      });
    } catch (error) {
      console.error('Error in queryApi.queryRows:', error);
      reject(error); // Reject the promise on error
    }
  });
}


// Function to process the query result
function processData(result) {
  const data = [];
  let i = 0;

  const allGroup = d3.group(result, (d) => d.time);

  allGroup.forEach((element) => {
    const dataObject = {};

    element.forEach((element2) => {
      const a = [element2.prop];
      if (a.some((r) => config.mainblacklist.indexOf(r) >= 0)) {
        return;
      }
      dataObject[element2.prop] = element2.value;
      dataObject.time = element2.time.toString();
    });

    data[i] = dataObject;
    i++;
  });

  return data;
}

// Main function to orchestrate the entire process
export async function JSquery() {
  await fetchSettings();
   var end = new Date(document.getElementById('field2').value); 
  end = end.setDate(end.getDate() + 1)
  end = formatDate(end) // take the next day instead

  var start = formatDate(new Date(document.getElementById('field1').value));

  const result = await performQuery(start, end);
  const processedData = processData(result);

  sessionStorage.setItem("response", JSON.stringify(processedData));
  //console.log(processedData)
  mapJS.mapfnc(),
    chartJS.create(),
    depthJS.depthchart()
  return processedData;
}

/*
//48 h zuerst
// get from and to date and convert them to query useable format
export async function JSquery() {
  // fetch settings async
  await fetchSettings();
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

  }; 
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

  return result;
};


*/
