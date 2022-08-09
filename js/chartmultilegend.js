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
var formatTime = d3.timeFormat("%Y-%m-%d %H:%M:%S");


//var to determine name of parameter
var sumstat;

//-----------------------PART 1 ---------------------------------------
//initial function to format data from query
export function create() {

  var data = sessionStorage.getItem("response");
  data = JSON.parse(data)

  var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
  //var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
  // format the data
  var data_long = [];

  //reform the tidy data form into long data form 
  data.forEach(function (d) {

    //--------------------- define parameters and their name
    //2022-05-12T07:28:47.000Z: delete Z and T and milliS
    //d.time = d.time.split("T")[0] + " " + d.time.split("T")[1].split("Z")[0]
    d.time = parseTime(d.time);
    d.TSYTemperatrue = +d.TSYTemperatrue;
    d.Temperature = +d.TSYTemperatrue;
    d.Oxygen = +d.Oxygen;
    d.MS5837Press = +d.MS5837Press;
    d.Pressure =(+d.MS5837Press);
    d.Conductivity = +d.Conducitvity / 1000;
      if(+d.Conducitvity != 0 && +d.TSYTemperatrue!= 0 && +d.Pressure!= 0){
    d.Salinity = salJS.gsw_sp_from_c(+d.Conducitvity / 1000, +d.TSYTemperatrue, +d.Pressure);}
    //console.log(+d.Salinity, +d.Conducitvity,+d.TSYTemperatrue, +d.Pressure )



    //---------------------example for new parameter based on existing data:------------------------
    //d.Foo = +d.TSYTemperatrue;


    for (var prop in d) {
      var a = [prop];
      //blacklist element check
      if (a.some(r => config.chartblacklist.indexOf(r) >= 0)) { continue; }
      var y = prop,
        value = +d[prop];
      //time cant be undefined or null and so 
      if (d.time === null || d.depl === null || value === null || value === 0) { continue; }
      //threshhold function
      if (config.thresholdProp.indexOf(prop) != -1 && config.thresholdValues[config.thresholdProp.indexOf(prop)][0] != "") {

        if (config.thresholdValues[config.thresholdProp.indexOf(prop)][0] > value
          || config.thresholdValues[config.thresholdProp.indexOf(prop)][1] < value) {
          var timeStorage = formatTime(d.time);

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

      //for each entry of long data push x = time , y = parameter name, value = parameter value, depl = deployment id
      data_long.push({
        x: d.time,
        y: y,
        value: +value,
        depl: d.deployment
      });
      //console.log(data_long)

    }
  });
  data = data_long;
  //console.log(data)
  // add an  all-options to the list
  var text_node = d3.select("#list")
    .selectAll('allOption')
    .data([1])//to generate just one/ it works
    .enter()
    .append('option')
    .attr("value", 0) // corresponding value returned by the button
    .attr('tabindex', 1)
    .attr("id", "option")
    .text("Back to selected Dates")
    .append('li')
    .text("Start:            " + document.getElementById('field1').value)
    .attr("value", -1) // corresponding value returned by the button
    .append('li')
    .text("End:            " + document.getElementById('field2').value)
    .attr("value", -1) // corresponding value returned by the button



  createsmallmultiple(data)

}

//------------------------------------ PART 2 ---------------------------------------------------------------
function createsmallmultiple(data) {
  // used to define line generaiotns later on 
  var diff = 0;

  // group the data: I want to draw one line per group
  sumstat = d3.group(data, d => d.y) // nest function allows to group the calculation per level of a factor

  //svg holding all elements
  var svg;
  //d3.select('svg').remove();

  // List of groups (here I have one group per column)
  var allGroup = new Set(data.map(d => d.depl))

  // add the options to the list
  d3.select("#list")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return "ID:" + d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button
    .attr('tabindex', 1)
    .append('li')
    //get start date 
    .text(function (d) { var selected = d; var start = data.filter(function (d) { return d.depl == selected }); return "Start: " + formatTime(start[0].x) })
    .attr("value", -1) // corresponding value returned by the button
    .append('li')
    // get end date 
    .text(function (d) { var selected = d; var end = data.filter(function (d) { return d.depl == selected }); return "   End: " + formatTime(end[end.length - 1].x) })
    .attr("value", -1) // corresponding value returned by the button


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

  // Add X axis --> it is a date format
  const x = d3.scaleTime()
    .domain(d3.extent(data, function (d) { return d.x; }))
    .range([0, width]);
  var xAxis = svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(4));

  //Add Y axis
  var yAxis = svg
    .append("g")
    .each(function (d, i) {
      //console.log(d)
      var min = d3.min(d[1], function (d) { return +d.value; })
      var max = d3.max(d[1], function (d) { return +d.value; })
      var y2 = d3.scaleLinear()
        .domain([min * 5 / 6, max * 7 / 6])
        .range([height, 0]);
      var svg1 = d3.select(this);

      svg1.call(d3.axisLeft(y2).ticks(6));


    })

  // Add titles
  svg
    .append("text")
    .attr("text-anchor", "start")

    .attr("y", -5)
    .attr("x", 0)
    .text(function (d) {
      if (config.thresholdUnits[config.thresholdProp.indexOf(d[0])] != undefined) {
        return (d[0] + "(" + config.thresholdUnits[config.thresholdProp.indexOf(d[0])]) + ")"
      }
      else {
        return d[0]
      }
    })
    .style("fill", function (d) { return config.chartcolor(d[0]) })


  // Add a clipPath: everything out of this area won't be drawn.
  const clip = svg.append("defs").append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0);

  // Add brushing
  const brush = d3.brushX()                   // Add the brush feature using the d3.brush function
    .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

  // Create the line variable: where both the line and the brush take place
  const line = svg.append('g')
    .attr("clip-path", "url(#clip)")

  // Draw the line
  line.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", function (d) { return config.chartcolor(d[0]) }) // config color function
    .attr("stroke-width", 1.9)
    .attr("d", function (d) {

      var min = d3.min(d[1], function (d) { return +d.value; })
      var max = d3.max(d[1], function (d) { return +d.value; })

       
       
      var mapY = d3.scaleLinear()
        .domain([min * 5 /6, max * 7 /6])
        .range([height, 0])

      var lineGen = d3.line()
        .defined(function (d) { var i = d.x - diff; diff = d.x; return i <= 300000; }) //function to not connect values which are 5 minuets apart
        .x(function (d) { return x(d.x); })
        .y(d => { return mapY(+d.value); }
        )
        (d[1])
      return lineGen;

    })




  //----------------------------------- Brushing functionality ---------------
  // Add the brushing
  line
    .append("g")
    .attr("class", "brush")
    .call(brush);

  // A function that set idleTimeOut to null
  let idleTimeout
  function idled() { idleTimeout = null; }
  //----------------------------------- PART 3 ---------------------------------------------------
  // A function that update the chart for given boundaries after brushing
  function updateChart(event, d) {
    var dataFilter = 0;
    // What are the selected boundaries?
    var extent = event.selection;
    // console.log(x.invert(extent[0]))
    //console.log(extent);
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
            .domain([min , max ])// i dont know why but this doesnt need to be multiplied
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
          .domain([min * 5 / 6, max * 7 / 6])
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

  //------------------------------------------end Brushing-------------------------------
  //update function for deploy id
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
          .domain([min * 5 / 6, max * 7 / 6])
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
          .domain([min * 5 / 6, max * 7 / 6])
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


  //---------------mooseover end




  // When the button is changed, run the updateChart function to return to all-state
  d3.select("#list").on("click", function (event, d) {
    // recover the option that has been chosen
    const selectedOption = event.explicitOriginalTarget.value

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
            .domain([min * 5 / 6, max * 7 / 6])
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
            .domain([min * 5 / 6, max * 7 / 6])
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



}


export function resetCharts() {
  d3.selectAll('svg').remove();
  d3.selectAll('option').remove();
  d3.selectAll('li').remove();
 
  
}


