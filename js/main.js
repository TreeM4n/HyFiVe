import * as mapJS from './map.js';
import * as queryJS from './jsquery.js';
import * as chartJS from './chartmultilegend.js';

//Zeile 254 m�sste stehen "#flux-enabled = false" was ge�ndert werden muss zu "flux-enabled = true" 
var hours = 48;

var data ;
function initial(){
var today = new Date();
var last48h = today - (3600000 *hours);
//var parseToday = d3.timeParse("%f");
var formatData = d3.timeFormat("%Y-%m-%d");
//today = parseToday(today).toString(); -> query(today)
//.toISOString() 
//console.log(formatData(last48h))
queryJS.query(today.toISOString(),last48h).then(response => {data = response;//mapJS.mapfnc(data);
chartJS.create(data)});

document.getElementById('field2').value = formatData(today);
document.getElementById('field1').value = formatData(last48h);

}
initial();




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