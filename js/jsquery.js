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
async function performQuery(deployment) {
  return new Promise(async (resolve, reject) => {
    // hyfive.inf0 = bucket:hyfive measurement. CLUPEA
    var end = new Date(document.getElementById('field2').value);
    //console.log(end)
    end = end.setDate(end.getDate() + 1)
    //console.log(end)
    end = formatDate(end) // take the next day instead

    var start = formatDate(new Date(document.getElementById('field1').value));
    var interval = document.getElementById('field_interval').value
    const fluxQuery = `from(bucket:"localhyfive") 
                    |> range(start: ${start}, stop: ${end}) 
                    |> filter(fn: (r) => r._measurement == "netcdf")
                    |> filter(fn: (r) => r["deployment_id"] == "${deployment}")    
                    |> filter(fn: (r) => r._value != -99)                            
                    |> window(every: ${interval})
                    |> mean()`;
    const influxDB = new InfluxDB({ url, token });
    const queryApi = influxDB.getQueryApi(org);

    const result = [];
    //console.log(fluxQuery)
    try {
      await queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          const data = { "time": o._start, "value": o._value, "prop": o._field };
          result.push(data);
        },
        error(error) {
          console.log('QUERY FAILED', error);
          reject(error); // Reject the promise on error
        },
        complete() {
          //console.log(result)
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
      //if (a.some((r) => config.mainblacklist.indexOf(r) >= 0)) {return;}
      dataObject[element2.prop] = element2.value;
      dataObject.time = element2.time.toString();
    });

    data[i] = dataObject;
    i++;
  });

  return data;
}


var deploymentlist = [];
// Main function to orchestrate the entire process
export async function JSquery() {
  await fetchSettings();
  var end = new Date(document.getElementById('field2').value);
  //console.log(end)
  end = end.setDate(end.getDate() + 1)
  //console.log(end)
  end = formatDate(end) // take the next day instead

  var start = formatDate(new Date(document.getElementById('field1').value));

  var deployment = await performdeploymentQuery(start, end);
  var deployment_ids = [];
  deploymentlist = [] // reset list
  d3.select("#list")
  .selectAll("option").remove();
  for (var i = 0; i < deployment.length; i++) {
    var deployment_first = await performdateQuery(deployment[i].value)
    //console.log(deployment_first)
    //deployment_ids.push(deployment[i].value);
  }
  //console.log(deploymentlist)
  try {
    // Sort the array based on the "depl" property
    deploymentlist.sort(function (a, b) {      
      return a.time.localeCompare(b.time);
    });
  } catch (error) {
    console.log(error)
  }

  //console.log((formatTime2(parseTime2(deploymentlist[1][0].time))))
  //console.log(((parseTime2(deploymentlist[1][0].time))))
  //console.log((((deploymentlist[1][0].time))))
  for (var i = 1; i < deploymentlist.length; i++) {
    //console.log(deploymentlist[i])
    var formatTime2 = d3.timeFormat("%Y-%m-%d %H:%M");
    var parseTime2 = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");
    try {
      d3.select("#list")
        .selectAll('myOptions')
        .data(deploymentlist[i])
        .enter()
        .append('option')
        .text((formatTime2(parseTime2(deploymentlist[i][0].time)))+" || "+ deploymentlist[i][0].depl) // text shown in the menu            
        .attr("value", deploymentlist[i][0].depl) // corresponding value returned by the button
        .attr('tabindex', 1)
        .append('li')
    } catch (error) {
      console.log(error)
    }

  }

  //console.log(deploymentlist)

  //console.log(deployment)



  //const processedData = (result);


  return 0;
}



// Function to perform the InfluxDB query
async function performdeploymentQuery(start, end) {
  return new Promise(async (resolve, reject) => {
    // hyfive.inf0 = bucket:hyfive measurement. CLUPEA
    // var interval = document.getElementById('field_interval').value
    const fluxQuery = `from(bucket:"localhyfive") 
                    |> range(start: ${start}, stop: ${end}) 
                    |> filter(fn: (r) => r._measurement == "netcdf")
                    |> filter(fn: (r) => r["_field"] == "latitude" )  
                    |> distinct(column: "deployment_id")              
                    `;
    const influxDB = new InfluxDB({ url, token });
    const queryApi = influxDB.getQueryApi(org);

    const result = [];

    try {
      await queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          const data = { "time": o._start, "value": o._value, "prop": o._field };
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

// Function to perform the InfluxDB query
async function performdateQuery(deployment_id) {
  return new Promise(async (resolve, reject) => {

    const dateString = "1970-01-01 12:12:12";
    const dateString2 = "2170-01-01 12:12:12";

    const unixTimestampstart = new Date(dateString).getTime() / 1000;
    const unixTimestampend = new Date(dateString2).getTime() / 1000;


    const fluxQuery = `from(bucket:"localhyfive")
                    |> range(start: ${unixTimestampstart}, stop: ${unixTimestampend})
                    |> filter(fn: (r) => r._measurement == "netcdf")
                    |> filter(fn: (r) => r["deployment_id"] == "${deployment_id}")
                    |> filter(fn: (r) => r["_field"] == "latitude" )                       
                    |> min(column: "_time")
                    |> yield(name: "min_time")
                    `;
    const influxDB = new InfluxDB({ url, token });
    const queryApi = influxDB.getQueryApi(org);

    const result = [];

    try {
      await queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          const data = { "time": o._time, "value": o._value, "prop": o._field, "depl": o.deployment_id };
          //console.log(data)
          result.push(data);
        },
        error(error) {
          console.log('QUERY FAILED', error);
          reject(error); // Reject the promise on error
        },
        complete() {
          try {
            deploymentlist.push(result)
            /*
            d3.select("#list")
              .selectAll('myOptions')
              .data(result)
              .enter()
              .append('option')
              .text((formatTime2(parseTime2(result[0].time))) + " fix this") // text shown in the menu            
              .attr("value", result[0].depl) // corresponding value returned by the button
              .attr('tabindex', 1)
              .append('li')
              */
          }
          catch (error) {

          }
          resolve(result); // Resolve the promise when the query is complete



        }

      });
    } catch (error) {
      console.error('Error in queryApi.queryRows:', error);
      reject(error); // Reject the promise on error
    }
  });
}


export async function performDataQuery(deployment) {

  const result = await performQuery(deployment);
  const processedData = processData(result);
  const attributeQuery = await performattributeQuery(deployment) 
  const attributes = attributeQuery[0]
  const units = attributeQuery[1]

  //console.log(units)

  sessionStorage.setItem("response", JSON.stringify(processedData));
  sessionStorage.setItem("attributes", JSON.stringify(attributes));
  sessionStorage.setItem("units", JSON.stringify(units));

  chartJS.resetonlyCharts()
  chartJS.create()
  await mapJS.clearMap()
  mapJS.mapfnc()
  depthJS.depthchart()


}

// When the button is changed, run the updateChart function to return to all-state
d3.select("#list").on("click", function (event, d) {
  // recover the option that has been chosen

 // console.log("hi")


  const selectedOption = event.target.value

  //console.log( event.explicitOriginalTarget)
  if (selectedOption == 0) {
    // do nothing for description, all time doesnt exist

  }
  else if (selectedOption == -1) {
    // do nothing for description
  }
  else if (selectedOption == undefined) {
    // do nothing in case
  }
  else {
    // run the updateChart function with this selected option
    performDataQuery(selectedOption)


  }

})


// Function to perform the InfluxDB query
async function performattributeQuery(deployment) {
  return new Promise(async (resolve, reject) => {
    // hyfive.inf0 = bucket:hyfive measurement. CLUPEA
    var end = new Date(document.getElementById('field2').value);
    //console.log(end)
    end = end.setDate(end.getDate() + 1)
    //console.log(end)
    end = formatDate(end) // take the next day instead

    var start = formatDate(new Date(document.getElementById('field1').value));
    
    const fluxQuery = `from(bucket:"localhyfive") 
                    |> range(start: ${start}, stop: ${end}) 
                    |> filter(fn: (r) => r._measurement == "attributes")
                    |> filter(fn: (r) => r["deployment_id"] == "${deployment}" )  
                    |> filter(fn: (r) => r["_field"] == "unit")              
                                    
                    |> group()
                    `;
    const influxDB = new InfluxDB({ url, token });
    const queryApi = influxDB.getQueryApi(org);

    const result = ["salinity"];
    const result_unit = ["mg/l"];

    try {
      await queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          //console.log(o)
          if(o.parameter !== "logger") {
            //const data = { "parameter": o.parameter};
            result.push(o.parameter);
            result_unit.push(o._value);

          }          
        },
        error(error) {
          console.log('QUERY FAILED', error);
          reject(error); // Reject the promise on error
        },
        complete() {
          resolve( [result, result_unit ]); // Resolve the promise when the query is complete
        }
      });
    } catch (error) {
      console.error('Error in queryApi.queryRows:', error);
      reject(error); // Reject the promise on error
    }
  });
}

// Function to perform the InfluxDB query
async function performparameterQuery(start, end,parameter) {
  return new Promise(async (resolve, reject) => {
    // hyfive.inf0 = bucket:hyfive measurement. CLUPEA
    // var interval = document.getElementById('field_interval').value
    const fluxQuery = `from(bucket:"localhyfive") 
                    |> range(start: ${start}, stop: ${end}) 
                    |> filter(fn: (r) => r._measurement == "attributes")
                    |> filter(fn: (r) => r.parameter == ${parameter})
                    |> filter(fn: (r) => r["_field"] == "unit" )                               
                    `;
    const influxDB = new InfluxDB({ url, token });
    const queryApi = influxDB.getQueryApi(org);

    const result = [];

    try {
      await queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          const data = { "time": o._start, "value": o._value, "prop": o._field };
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

/*


from(bucket: "localhyfive")

  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)

  |> filter(fn: (r) =>
r["_measurement"] == "netcdf")

  |> pivot(rowKey: ["_time"], columnKey: ["_field"],
valueColumn: "_value")

  |> filter(fn: (r) =>
r["latitude"] > -99)
*/