import * as mapJS from './map.js';
import * as queryJS from './jsquery.js';
import * as depthJS from './depthchart.js';

var hours = 48;

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



		//-------------------------------------
		mapJS.mapfnc();
		depthJS.depthchart()
	}
	else {
		end = new Date();
		start = end - (3600000 * hours);


		document.getElementById('field2').value = formatData(end);
		document.getElementById('field1').value = formatData(start);
		sessionStorage.setItem("sessionfield1", document.getElementById('field1').value);
		sessionStorage.setItem("sessionfield2", document.getElementById('field2').value);


		//--------------------------------------
		queryJS.query().then(response => {
			var data = [];
			/*
			var i = 0 ; 
			//console.log(response)
			var allGroup = d3.group(response, d => d.time)
			allGroup.forEach(element => {
				
				
				var dataObject = {};
				//console.log(element)
				element.forEach(element2 =>{
					
					dataObject[element2.prop] = element2.value;
					dataObject.time = element2.time.toString();
				} )
				data[i] = dataObject;
				//console.log(dataObject);
				i++;
				dataObject = {};
				//console.log(data)
			});
			*/
			//sessionStorage.setItem("response", JSON.stringify(data));
			//console.log((response))
			sessionStorage.setItem("response", JSON.stringify(response));
			mapJS.mapfnc();
			depthJS.depthchart()

		});

	}
	//today = parseToday(today).toString(); -> query(today)
	//.toISOString() 
	//console.log(formatData(last48h))



}
initial();


//update session resources
export function timeselected() {
	sessionStorage.setItem("sessionfield1", document.getElementById('field1').value);
	sessionStorage.setItem("sessionfield2", document.getElementById('field2').value);
	console.log(sessionStorage.getItem("sessionfield1"))
}
document.querySelector('#field1').addEventListener('onchange', timeselected)
document.querySelector('#field2').addEventListener('onchange', timeselected)



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