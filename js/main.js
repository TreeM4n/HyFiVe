import * as mapJS from './map.js';
import * as queryJS from './jsquery.js';
import * as chartJS from './chartmultilegend.js';
import * as config from './config.js';


var hours = config.initialhours;


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


	queryJS.query().then(response => {
		var data= [];
		
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

		//console.log((data))
		sessionStorage.setItem("response", JSON.stringify(data));
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
	//document.getElementById('Temperature').style.display = none;
	
	if (!date1 || !date2) {

		console.log("error")
	}
	else {
		sessionStorage.setItem("sessionfield1", document.getElementById('field1').value);
		sessionStorage.setItem("sessionfield2", document.getElementById('field2').value);
		queryJS.query().then(response => {
			console.log(response)
			sessionStorage.setItem("response", JSON.stringify(response));
			chartJS.resetCharts();
		
		});
		
	}
}

document.querySelector('#reload').addEventListener('click', reload)

//console.log(queryJS.query())
//mapJs.mapfnc(queryJS.query());