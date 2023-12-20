import * as config from './config.js';
import * as mapJS from './map.js';
import * as salJS from './salinity.js'



/*
script is separated into 3 parts

1. taking data and format it long data form
2. draw elemts (svg, axis, labels etc) and add functionality
3. fucntions to check for clicks and update the element accordingly

*/
// set the dimensions and margins of the graph 20% x 20% ratio to viewport
const margin = { top: 30, right: 0, bottom: 30, left: 50 },
  width = window.innerWidth / 10 * 2 - margin.left - margin.right,
  height = window.innerWidth / 10 * 2 - margin.top - margin.bottom;

// format the date / time
//2022-05-12T07:28:47.000Z
var formatTime = d3.utcFormat("%Y-%m-%d %H:%M:%S");


//svg holding all elements
var svg;

//var to determine name of parameter
var sumstat;
var units;

//-----------------------PART 1 ---------------------------------------
//initial function to format data from query
export async function create() {

  var data = sessionStorage.getItem("response");
  data = JSON.parse(data)
  var attributes = sessionStorage.getItem("attributes");
  attributes = JSON.parse(attributes)
  attributes.push("depth")
  attributes = attributes.filter(e => e !== 'pressure');
  units = sessionStorage.getItem("units");
  units = JSON.parse(units)
  units = units.filter(e => e !== 'mbar');
  units.push("m")

  for (let index = 0; index < units.length; index++) {
    units[index] = [units[index], attributes[index]];

  }
  //console.log(units)

  var parseTime = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");
  var parseTime2 = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");

  // format the data
  var data_long = [];

  try {
    //reform the tidy data form into long data form 
    data.forEach(function (d) {

      //--------------------- define parameters and their name
      //2022-05-12T07:28:47.000Z: delete Z and T and milliS
      //d.time = d.time.split("T")[0] + " " + d.time.split("T")[1].split("Z")[0]
      d.time = parseTime2(d.time);

      d.depth = (+d.pressure - 1013) / 100
      //d.Temperature = +d.TSYTemperatrue;


      //d.MS5837Press = +d.MS5837Press;
      //d.Pressure = (+d.MS5837Press);
      //d.Conductivity = +d.Conducitvity / 1000; //micro to milli
      //d.Conductivity = +d.Conductivity; //micro to milli
      // check if exist and not null
      try {
        if (+d.conductivity != 0 && +d.temperature != 0 && +d.pressure != 0) {
          d.salinity = salJS.gsw_sp_from_c(+d.conductivity, +d.temperature, +d.pressure);
        }
      } catch (error) {
        console.log(error)
      }

      for (var prop in d) {
        var a = prop;
        //blacklist element check
        //if (a.some(r => config.chartblacklist.indexOf(r) >= 0)) { continue; }

        //console.log(a + "+" + attributes)
        //console.log(attributes.includes(a))
        if (attributes.includes(a)) { } else { continue; }
        var y = prop,
          value = +d[prop];
        //time cant be undefined or null and so 

        if (d.time === null || value === null || value === 0 || isNaN(value)) { continue; }
        //threshhold function
        /*
        if (config.thresholdProp.indexOf(prop) != -1 && config.thresholdValues[config.thresholdProp.indexOf(prop)][0] != "") {

          if (config.thresholdValues[config.thresholdProp.indexOf(prop)][0] > value
            || config.thresholdValues[config.thresholdProp.indexOf(prop)][1] < value) {
            var timeStorage = formatTime2(d.time);


            d3.select("#ULerror")
              .selectAll('myOptions')
              .data([1])//to generate just one / it works
              .enter()
              .append('li')
              //value and parameter
              .text(function (d) { return "Threshold reached: " + prop + " was:" + value })
              .style('padding', '4px')
              .style('color', 'orange')
              .attr("value", -1) // corresponding value returned by the button
              //get start date 
              .append('li')
              .text(function (d) { return "at " + timeStorage + " UTC" })
              .style('padding', '4px')
              .style('color', 'orange')
              .attr("value", -1) // corresponding value returned by the button

            continue;
          }
        }
        */

        //for each entry of long data push x = time , y = parameter name, value = parameter value, depl = deployment id
        data_long.push({
          x: d.time,
          y: y,
          value: +value,
          depl: d.deployment_id
        });


      }
    });
    data = data_long;
    //console.log(data)
    // add an  all-options to the list
    /*
    var text_node = d3.select("#list")
      .selectAll('allOption')
      .data([1])//to generate just one/ it works
      .enter()
      .append('option')
      .classed("horizontal", true)
      .classed("selected", true)
      .attr("value", 0) // corresponding value returned by the button
      .attr('tabindex', 1)
      .attr("id", "option")
      .text("Whole Selection")
    */
    /*
    .append('li')
    .text("Start:            " + document.getElementById('field1').value)
    .attr("value", -1) // corresponding value returned by the button
    .append('li')
    .text("End:            " + document.getElementById('field2').value)
    .attr("value", -1) // corresponding value returned by the button
   */


    createsmallmultiple(data)

  }

  catch (error) {
    console.log(error)
  }
}
//------------------------------------ PART 2 ---------------------------------------------------------------
async function createsmallmultiple(data) {
  // used to define line generaiotns later on 
  var diff = 0;

  // group the data: I want to draw one line per group
  sumstat = d3.group(data, d => d.y) // nest function allows to group the calculation per level of a factor


  //d3.select('svg').remove();
  /*
  // List of groups (here I have one group per column)
  var allGroup = new Set(data.map(d => d.depl))
  allGroup.delete(undefined) // just remove undefined values
  // add the options to the list
  
  d3.select("#list")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return "ID:" + d; }) // text showed in the menu
    .text(function (d) { var selected = d; var start = data.filter(function (d) { return d.depl == selected }); return "" + formatTime2(start[0].x); })
    .attr("value", function (d) { return d; }) // corresponding value returned by the button
    .attr('tabindex', 1)
    .append('li')
    */
  //get start date 
  //.text(function (d) { return "ID:" + d; }) // text showed in the menu
  //.attr("value", -1) // corresponding value returned by the button
  // .append('li')
  // get end date 
  //.text(function (d) { var selected = d; var end = data.filter(function (d) { return d.depl == selected }); return "   End: " + formatTime2(end[end.length - 1].x); })
  //.attr("value", -1) // corresponding value returned by the button


  // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
  svg = d3.select("#my_dataviz")
    .selectAll("uniqueChart")
    .data(sumstat)
    .enter()
    .append("svg")
    .attr("id", function (d) { return d[0]; })
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("value", function (d) { return d[0]; })
    .attr("transform",
      `translate(${margin.left},${margin.top})`)

  const view = svg.append("rect")
    .attr("id", "view")
    .attr("x", 0.5)
    .attr("y", 0.5)
    .attr("width", width - 1)
    .attr("height", height - 1)
    .style("fill", "white");

  // Add X axis --> it is a date format
  const x = d3.scaleTime()
    .domain(d3.extent(data, function (d) { return d.x; }))
    .range([0, width])
    .nice();




  // Add titles
  svg
    .append("text")
    .attr("text-anchor", "start")

    .attr("y", 0)
    .attr("x", 0)
    .text(function (d) {
      return d[0]

    })
    .style("fill", function (d) { return config.chartcolor(d[0]) })
  /*
    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height+20)
      .text("UTC Time Zone");
  */



  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -45)
    .attr("x", 0)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text(function (d) {
      for (let i = 0; i < units.length; i++) { //console.log(units[i][1] +"+"+d[0])
        if (units[i][1] === d[0]) {
          return units[i][0];
        }
      }
      // Return a default value or handle the case when the target is not found
      return null; // You can adjust this based on your specific needs})
    })
  // Add a clipPath: everything out of this area won't be drawn.
  const clip = svg.append("defs").append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    //.attr("x", 0.5)
    //.attr("y", 0.5)
    .attr("width", width - 1)
    .attr("height", height - 1);

  // Create the line variable: where both the line and the brush take place
  const line = svg.append('g')
    .attr("z", 1); // Set a higher z value for the axis
  //.attr("clip-path", "url(#clip)")

  // Draw the line
  var path = line.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", function (d) { return config.chartcolor(d[0]) }) // config color function
    .attr("stroke-width", 1.9)
    .attr("z", 1) // Set a lower z value for the line

    .attr("d", function (d) {

      var min = d3.min(d[1], function (d) { return +d.value; })
      var max = d3.max(d[1], function (d) { return +d.value; })



      var mapY = d3.scaleLinear()
        .domain([min, max])
        .range([height, 0])

      var lineGen = d3.line()
        .defined(function (d) { var i = d.x - diff; diff = d.x; return i <= 300000; }) //function to not connect values which are 5 minuets apart
        .x(function (d) { return x(d.x); })
        .y(d => { return mapY(+d.value); }
        )
        (d[1])
      return lineGen;

    })

  var xAxis = svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr("z", 1) // Set a higher z value for the axis
    .call(d3.axisBottom(x).ticks(4));


  //Add Y axis
  var yAxis = svg
    .append("g")
    .attr("z", 2) // Set a higher z value for the axis
    .each(function (d, i) {
      //console.log(d)
      var min = d3.min(d[1], function (d) { return +d.value; })
      var max = d3.max(d[1], function (d) { return +d.value; })
      var y2 = d3.scaleLinear()
        .domain([min, max])
        .range([height, 0])
        .nice();
      var svg1 = d3.select(this);

      svg1.call(d3.axisLeft(y2).ticks(6));

    })

  ////-------------------------------- zoom ---------------------



  svg.call(d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([1, 10])
    .on("zoom", zoomed));


  function zoomed({ transform }) {
    line.attr("transform", transform);

    // Get the current zoom scale
    const currentScale = transform.k;

    // Calculate the scaled stroke width
    const scaledStrokeWidth = 1.9 / currentScale;

    // Set the new stroke width for the line
    path.attr("stroke-width", scaledStrokeWidth);

    // Get scaled x and y scales
    const newXScale = transform.rescaleX(x);


    xAxis.call(d3.axisBottom(newXScale).ticks(4));
    yAxis.each(function (d, i) {
      //console.log(d)
      var min = d3.min(d[1], function (d) { return +d.value; })
      var max = d3.max(d[1], function (d) { return +d.value; })
      var y2 = d3.scaleLinear()
        .domain([min, max])
        .range([height, 0])
        .nice();
      var svg1 = d3.select(this);
      const newYScale = transform.rescaleY(y2);
      svg1.call(d3.axisLeft(newYScale).ticks(6));

    })

  }

  /*
    var zoomCallback = function () {
      var newX = d3.transform.rescaleX(x);
      //var newY = d3.transform.rescaleY(yAxis);
  
      xAxis.call(d3.axisBottom(newX));
     // axLft.call(d3.axisLeft(newY));
  
      /*
      d3.selectAll('#pointline')
        .attr("d",
          d3.line()
            .x(function (d) { return newX(d[0]); })
            .y(function (d) { return newY(d[1]); })
            .curve(d3.curveMonotoneX)
        );
        
    }
  
    let zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .extent([[0, 0], [width, height]])
      .translateExtent([[0, 0], [width, height]])
      .on('zoom', zoomCallback);
  
    d3.select('svg').call(zoom);
    */
  /////////////////////////////////

  /*

  //----------------------------------- Brushing functionality ---------------
  // Add the brushing
  // Add brushing
  const brush = d3.brushX()                   // Add the brush feature using the d3.brush function
    .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

  line
    .append("g")
    .attr("class", "brush")
    .call(brush);

  // A function that set idleTimeOut to null
  let idleTimeout = null;
  function idled() {


    idleTimeout = null;
  }
  //----------------------------------- PART 3 ---------------------------------------------------
  // A function that update the chart for given boundaries after brushing
  function updateChart(event, d) {
    var dataFilter = 0;
    // What are the selected boundaries?
    var extent = event.selection;
    /*
    // console.log(x.invert(extent[0]))
    console.log(d);
    console.log(x.invert(d3.pointer(event)[0]),idleTimeout);
    console.log(extent)
    //
    /*
   
       var time = x.invert(d3.pointer(event)[0]);
  
     var formatTime = d3.timeFormat("%Y-%m-%d %H:%M");
    var dataFilter = data.filter(function (d) { return formatTime(d.x) == formatTime(time)})
    //console.log(dataFilter[0])
    document.getElementById('stats').textContent = dataFilter[0].y + dataFilter[0].depl;
      mapJS.showpoint(x.invert(d3.pointer(event)[0]))
     
    //
    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if (!extent) {
      if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
      //x.domain(d3.extent(data, function(d) { return d.year; }))
      //x.range([0, width]);





    } else {

      x.domain([x.invert(extent[0]), x.invert(extent[1])])

      dataFilter = data.filter(function (d) { return d.x >= x.invert(extent[0]) })
      dataFilter = dataFilter.filter(function (d) { return d.x <= x.invert(extent[1]) })
      //datafilter here is broken, shortens the start and end time
      line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done



    }

    if (dataFilter != 0) {
      // Update axis and line position

      xAxis
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x).ticks(4));



      yAxis
        .transition()
        .duration(1000)
        .each(function (d, i) {
          var value = d[1][1].y;
          var dataFilter2 = dataFilter.filter(function (d) { return d.y == value })
          var min = d3.min(dataFilter2, function (d) { return +d.value; })
          var max = d3.max(dataFilter2, function (d) { return +d.value; })
          var y2 = d3.scaleLinear()
            .domain([min, max])
            .range([height, 0]);
          var svg1 = d3.select(this);

          svg1
            .transition()
            .duration(1000)
            .call(d3.axisLeft(y2).ticks(6));


        })
    }

    //update line 
    line
      .select('.line')
      .transition()
      .duration(1000)
      .attr("d", function (d) {

        var value = d[1][1].y;
        var dataFilter2 = data.filter(function (d) { return d.y == value })
        var min = d3.min(dataFilter2, function (d) { return +d.value; })
        var max = d3.max(dataFilter2, function (d) { return +d.value; })

        var mapY = d3.scaleLinear()
          .domain([min, max])
          .range([height, 0])

        var lineGen = d3.line()
          .defined(function (d) { var i = d.x - diff; diff = d.x; return i <= 300000 && +d.value != 0; })
          .x(function (d) { return x(d.x); })
          .y(d => {//console.log(mapY(+d.value)); 
            return mapY(+d.value);
          })

          (d[1])

        return lineGen

      })

  }
  */
  //------------------------------------------end Brushing-------------------------------
  //update function for deploy id
  var chartsalreadycreate = false;
  function updateChart2(selectedGroup) {

    var dataFilter = data.filter(function (d) { return d.depl == selectedGroup })

    x.domain(d3.extent(dataFilter, function (d) { return d.x; }))
    // Update axis and line position
    xAxis
      .transition()
      .duration(1000)
      .call(d3.axisBottom(x).ticks(4));

    yAxis
      .transition()
      .duration(1000)
      .each(function (d, i) {
        var value = d[1][1].y;
        var dataFilter2 = dataFilter.filter(function (d) { return d.y == value })
        var min = d3.min(dataFilter2, function (d) { return +d.value; })
        var max = d3.max(dataFilter2, function (d) { return +d.value; })
        var y2 = d3.scaleLinear()
          .domain([min, max])
          .range([height, 0]);
        var svg1 = d3.select(this);

        svg1
          .transition()
          .duration(1000)
          .call(d3.axisLeft(y2).ticks(6));


      })


    line
      .select('.line')
      .transition()
      .duration(1000)
      .attr("d", function (d) {
        var value = d[1][1].y;
        var dataFilter2 = dataFilter.filter(function (d) { return d.y == value })
        var min = d3.min(dataFilter2, function (d) { return +d.value; })
        var max = d3.max(dataFilter2, function (d) { return +d.value; })



        var mapY = d3.scaleLinear()
          .domain([min, max])
          .range([height, 0])

        var lineGen = d3.line()
          .defined(function (d) { var i = d.x - diff; diff = d.x; return i <= 300000 && +d.value != 0; })
          .x(function (d) { return x(d.x); })
          .y(d => {//console.log(mapY(+d.value)); 
            return mapY(+d.value);
          })

          (d[1])

        return lineGen

      })
    //refocus map and set markers
    mapJS.setmapview(dataFilter);

  }

  // idk where this broke, but mouseleave isnt noticed anymore
  /*
  // --------- mouseover start
  //visual effect for single svg's
  svg.on("mouseover", function (d) {

    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  })

  svg.on("mouseleave", function (d) {

    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  })

*/

  //---------------mooseover end



  /*
    // When the button is changed, run the updateChart function to return to all-state
    d3.select("#list").on("click", function (event, d) {
      // recover the option that has been chosen
  
  
  
  
      const selectedOption = event.target.value
  
      //console.log( event.explicitOriginalTarget)
      if (selectedOption == 0) {
  
  
        x.domain(d3.extent(data, function (d) { ; return d.x; }))
        // Update axis and line position
        xAxis
          .transition()
          .duration(1000)
          .call(d3.axisBottom(x).ticks(4));
  
        yAxis
          .each(function (d, i) {
            //console.log(d)
            var min = d3.min(d[1], function (d) { return +d.value; })
            var max = d3.max(d[1], function (d) { return +d.value; })
            var y2 = d3.scaleLinear()
              .domain([min, max])
              .range([height, 0]);
            var svg1 = d3.select(this);
  
            svg1
              .transition()
              .duration(1000)
              .call(d3.axisLeft(y2).ticks(6));
  
  
          })
        line
          .select('.line')
          .transition()
          .attr("d", function (d) {
  
            var min = d3.min(d[1], function (d) { return +d.value; })
            var max = d3.max(d[1], function (d) { return +d.value; })
  
            var mapY = d3.scaleLinear()
              .domain([min, max])
              .range([height, 0])
  
            var lineGen = d3.line()
              .defined(function (d) { var i = d.x - diff; diff = d.x; return i <= 300000 && +d.value != 0; })
              .x(function (d) { return x(d.x); })
              .y(d => { return mapY(+d.value); })
  
              (d[1])
  
            return lineGen
  
          })
        //removes map marker
        mapJS.removemapview();
  
      }
      else if (selectedOption == -1) {
        // do nothing for description
      }
      else if (selectedOption == undefined) {
        // do nothing in case
      }
      else {
        // run the updateChart function with this selected option
        updateChart2(selectedOption)
  
      }
  
    })
  
  */

}


export function resetCharts() {
  // svg.selectAll("svg").remove();
  d3.select("#my_dataviz")
    .selectAll("svg").remove();
  d3.select("#my_dataviz2")
    .selectAll("svg").remove();
  d3.select("#UList").selectAll('option').remove();
  // d3.select("#Ulist").selectAll('li').remove();


}



export function resetonlyCharts() {
  // svg.selectAll("svg").remove();
  d3.select("#my_dataviz")
    .selectAll("svg").remove();
  d3.select("#my_dataviz2")
    .selectAll("svg").remove();


}
