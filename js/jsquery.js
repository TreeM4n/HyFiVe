//import * as mapJs from './map.js';

//var dataquery = [];

//48 h zuerst

export function query(date1,date2) {
 return jQuery.ajax({
    url: "./php/dummyquery.php",    //the page containing php script
    type: "post",    //request type,
    dataType: 'json',
    data: JSON.stringify({ date1: date1, date2: date2 }),
    success: function result(result) {
      //console.log(result);
      //dataquery = result;
      /*
      try {
        mapJs.mapfnc(dataquery);
      } catch (error) {
        console.error(error);

      }
      */
     
    }
  })
  //console.log(dataquery);
  //return dataquery;
};


