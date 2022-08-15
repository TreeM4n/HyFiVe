import * as mapJS from './map.js';
import * as queryJS from './jsquery.js';
import * as chartJS from './chartmultilegend.js';
import * as config from './config.js';

/*
Main initializer for "homepage" 
manages initiale query and execution of charts and map 
handles subqequent qeuries
*/
var hours = config.initialhours;

// on page load function is executed
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

		//--------------------------------------

	}

	if (sessionStorage.getItem("response")) {
		//-----------------
		mapJS.mapfnc();
		chartJS.create();
	}
	else {
		initialquery();
	}


	//today = parseToday(today).toString(); -> query(today)
	//.toISOString() 
	//console.log(formatData(last48h))




}

initial();
//sperated function for 

function initialquery() {
	queryJS.query().then(response => {
		var data = [];

		var i = 0;

		var allGroup = d3.group(response, d => d.time)
		//console.log(allGroup)
		allGroup.forEach(element => {

			//if (a.some(r => config.mainblacklist.indexOf(r) >= 0)) { return; }
			var dataObject = {};
			//console.log(element)
			element.forEach(element2 => {
				var a = [element2.prop];
				console.log(a)
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
		response = data;

		sessionStorage.setItem("response", JSON.stringify(response));


		//console.log((response))
		if (response) {

			//sessionStorage.setItem("response", JSON.stringify(response));
			chartJS.resetCharts()
			mapJS.mapfnc();
			chartJS.create()
		}

	});
}

document.getElementById('list').addEventListener('click', chartJS.console)

// reload for query
var parseDate = d3.timeParse("%Y-%m-%d");
export function reload() {
	var date1 = parseDate(document.getElementById('field1').value);
	var date2 = parseDate(document.getElementById('field2').value);
	//document.getElementById('Temperature').style.display = none;

	if (!date1 || !date2) {

		console.log("error")
	}
	else {
		sessionStorage.setItem("sessionfield1", document.getElementById('field1').value);
		sessionStorage.setItem("sessionfield2", document.getElementById('field2').value);

		queryJS.query().then(response => {
			var data = [];

			var i = 0;

			var allGroup = d3.group(response, d => d.time)
			//console.log(allGroup)
			allGroup.forEach(element => {

				//if (a.some(r => config.mainblacklist.indexOf(r) >= 0)) { return; }
				var dataObject = {};
				//console.log(element)
				element.forEach(element2 => {
					var a = [element2.prop];
					//console.log(a)
					if (a.some(r => config.mainblacklist.indexOf(r) >= 0)) {return; }
					dataObject[element2.prop] = element2.value;
					dataObject.time = element2.time.toString();
				})
				data[i] = dataObject;
				//console.log(dataObject);
				i++;
				dataObject = {};
				//console.log(data)
			});
			response = data;

			sessionStorage.setItem("response", JSON.stringify(response));


			//console.log((response))
			if (response) {

				//sessionStorage.setItem("response", JSON.stringify(response));
				chartJS.resetCharts()
				mapJS.mapfnc();
				chartJS.create()
			}

		});

	}


}

document.querySelector('#reload').addEventListener('click', reload)