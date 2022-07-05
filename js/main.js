import * as mapJS from './map.js';
import * as queryJS from './jsquery.js';
import * as chartJS from './chartmultilegend.js';
import * as config from './config.js';


var hours = config.initialhours;

var data ;
function initial(){

var end ;
var start;
if (sessionStorage.getItem("sessionfield1")) {
	end = document.getElementById('field2').value
	
	start = document.getElementById('field1').value
}
else {
	end = new Date();
	start = end - (3600000 *hours);
	end = end.toISOString();
}
 
//var parseToday = d3.timeParse("%f");
var formatData = d3.timeFormat("%Y-%m-%d");
//today = parseToday(today).toString(); -> query(today)
//.toISOString() 
//console.log(formatData(last48h))
queryJS.query(end,start).then(response => {data = response;
	mapJS.mapfnc(data);
chartJS.create(data)});

document.getElementById('field2').value = formatData(end);
document.getElementById('field1').value = formatData(start);
sessionStorage.setItem("sessionfield1", document.getElementById('field1').value);
sessionStorage.setItem("sessionfield2", document.getElementById('field2').value);
}

initial();

document.getElementById('list').addEventListener('click', chartJS.console)



var parseDate = d3.timeParse("%Y-%m-%d");


export function reload() {
   		var date1 = parseDate(document.getElementById('field1').value);
		var date2 = parseDate(document.getElementById('field2').value);
		if(!date1 || !date2 ){
		console.log("error")
		}
		else {
			//queryJS.query(2,2).then(response => {data = response;mapJS.mapfnc(data);chartJS.create(data)});
		}
  }

 document.querySelector('#reload').addEventListener('click', reload)

//console.log(queryJS.query())
//mapJs.mapfnc(queryJS.query());