import * as mapJS from './map.js';
import * as queryJS from './jsquery.js';
import * as chartJS from './chartmultilegend.js';
import * as config from './config.js';


var hours = config.initialhours;

var data;
function initial() {

	var end;
	var start;
	var formatData = d3.timeFormat("%Y-%m-%d");

	//save selected time for session
	if (sessionStorage.getItem("sessionfield1")) {

		end = sessionStorage.getItem("sessionfield2")
		start = sessionStorage.getItem("sessionfield1")

		document.getElementById('field2').value = (end);
		document.getElementById('field1').value = (start);
	}
	else {
		end = new Date();
		start = end - (3600000 * hours);


		document.getElementById('field2').value = formatData(end);
		document.getElementById('field1').value = formatData(start);
		sessionStorage.setItem("sessionfield1", document.getElementById('field1').value);
		sessionStorage.setItem("sessionfield2", document.getElementById('field2').value);

	}



	//today = parseToday(today).toString(); -> query(today)
	//.toISOString() 
	//console.log(formatData(last48h))
	queryJS.query(end, start).then(response => {
		sessionStorage.setItem("response", JSON.stringify(response));
		mapJS.mapfnc();
		chartJS.create()
	});

}

initial();

document.getElementById('list').addEventListener('click', chartJS.console)

// reload for query
var parseDate = d3.timeParse("%Y-%m-%d");
export function reload() {
	var date1 = parseDate(document.getElementById('field1').value);
	var date2 = parseDate(document.getElementById('field2').value);
	if (!date1 || !date2) {

		console.log("error")
	}
	else {
		sessionStorage.setItem("sessionfield1", document.getElementById('field1').value);
		sessionStorage.setItem("sessionfield2", document.getElementById('field2').value);
		//queryJS.query(2,2).then(response => {data = response;mapJS.mapfnc(data);chartJS.create(data)});
	}
}

document.querySelector('#reload').addEventListener('click', reload)

//console.log(queryJS.query())
//mapJs.mapfnc(queryJS.query());