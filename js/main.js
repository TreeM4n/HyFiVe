import * as mapJS from './map.js';
import * as queryJS from './jsquery.js';
import * as chartJS from './chartmultilegend.js';

var data ;
queryJS.query().then(response => {data = response;mapJS.mapfnc(data);chartJS.create(data)});

function test() {
    console.log("1")
  }


//console.log(queryJS.query())
//mapJs.mapfnc(queryJS.query());