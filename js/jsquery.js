import * as mapJS from './map.js';
import * as chartJS from './chartmultilegend.js';
import * as config from './config.js';



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


