import { mapfnc } from './map.js';

var dataquery = [];

export function query() {
  $.ajax({
    url: "./php/dummyquery.php",    //the page containing php script
    type: "post",    //request type,
    dataType: 'json',
    data: {},
    success: function result(result) {
      // console.log("query")
      dataquery = result;
      try {
        mapfnc(dataquery);
      } catch (error) {
        console.error(error);

      }
    }
  })
};

query();