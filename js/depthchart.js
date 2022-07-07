import * as config from './config.js';

// set the dimensions and margins of the graph
const margin = { top: 100, right: 60, bottom: 60, left: 60 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;


var depthdata = [];
var data_long = [];

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");


//Read the data
export function depthchart(result) {



  depthdata = result;
  // format the data
  //console.log(result)

  depthdata.forEach(function (d) {

    d.time = new Date(d.time);
    d.Temperature = +d.TSYTemperatrue;
    d.Oxygen = +d.Oxygen;

    //d.Pressure = +d.MS5837Press;
    d.Conducitvity = +d.Conducitvity;

    //shorten data
    for (var prop in d) {
      var a = [prop];
      if (a.some(r => config.dcblacklist.indexOf(r) >= 0)) { continue; }
      if (d.MS5837Press == null || d.Temperature == null || d.MS5837Press == 0 || d.Temperature == 0) { continue; }

      data_long.push({
        y: d.MS5837Press,
        time: d.time,
        x: d.Temperature,
        depl: d.deployment
      });

    }
    //cheat
    //console.log(depthdata)



  });
  depthdata = data_long;
  // List of groups (here I have one group per column)


  //  console.log(allGroup[Symbol.iterator]().next().value)
  createdepthchart(depthdata)

  function createdepthchart(data) {

    // List of groups (here I have one group per column)
    var allGroup = new Set(data.map(d => d.depl))

    var formatTime = d3.timeFormat("%Y-%m-%d %H:%M");


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
      .text(function (d) { var selected = d; var start = data.filter(function (d) { return d.depl == selected }); return "Start: " + formatTime(start[0].time) })
      .attr("value", -1) // corresponding value returned by the button
      .append('li')
      // get end date 
      .text(function (d) { var selected = d; var end = data.filter(function (d) { return d.depl == selected }); return "End: " + formatTime(end[end.length - 1].time) })
      .attr("value", -1) // corresponding value returned by the button


    /*
    // add the options to the dropdown 
    d3.select("#selectButton")
      .selectAll('myOptions')
      .data(allGroup)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button
*/

// draw the first id on loading page
    var dataFilter = data.filter(function (d) { return d.depl == data[0].depl })
    const x = d3.scaleLinear()
      .domain([d3.min(dataFilter, function (d) { return +d.x; }) * 5 / 6, d3.max(dataFilter, function (d) { return +d.x; }) * 7 / 6])
      .range([0, width]);
    var xAxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(4));
    // Add Y axis
    const y = d3.scaleLinear()
      .domain([d3.min(dataFilter, function (d) { return +d.y; }) * 7 / 6, d3.max(dataFilter, function (d) { return +d.y; }) * 5 / 6])
      .range([height, 0]);
    var yAxis = svg.append("g")
      .call(d3.axisLeft(y).ticks(4));

      var line = svg.append("path")
/*
    // Add the line
    var line = svg.append("path")
      .datum(dataFilter)
      .attr("fill", "none")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .curve(d3.curveBasis)
        .x(d => x(d.x))
        .y(d => y(d.y))
      )

      */
    //y axis
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -margin.top)
      .text(function (d) { return "Pressure" })
      .style("fill", function (d) { return "blue" })
    //x axis
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + 35)
      .text(function (d) { return "Temperature" })
      .style("fill", function (d) { return "red" })

    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
      dataFilter = data.filter(function (d) { return d.depl == selectedGroup })
      //console.log(dataFilter  )
      // Give these new data to update line

      x.domain([d3.min(dataFilter, function (d) { return +d.x; }) * 5 / 6, d3.max(dataFilter, function (d) { return +d.x; }) * 7 / 6])
      xAxis
      .transition()
      .duration(1000)
      .call(d3.axisBottom(x).ticks(4));
      
      y.domain([d3.max(dataFilter, function (d) { return +d.y; }) * 7 / 6, d3.min(dataFilter, function (d) { return +d.y; }) * 5 / 6])
      yAxis
      .transition()
      .duration(1000)
      .call(d3.axisLeft(y).ticks(4));
      
      line
        .datum(dataFilter)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .curve(d3.curveBasis)
          .x(d => x(d.x))
          .y(d => y(d.y))
        )


    }
    /* 
    //  needed for dropdown
    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function (event, d) {
      // recover the option that has been chosen
      const selectedOption = d3.select(this).property("value")
      // run the updateChart function with this selected option
      update(selectedOption)
    })
    */

    // When the button is changed, run the updateChart function
    d3.select("#list").on("click", function (event, d) {
      // recover the option that has been chosen
      const selectedOption = event.explicitOriginalTarget.value

      //console.log( event.explicitOriginalTarget)
     
      if (selectedOption == -1) {
        // do nothing for description
      }
      else {
        // run the updateChart function with this selected option
        update(selectedOption)
        //console.log(event.explicitOriginalTarget)
      }

    })
    /*
    // Add the points
    svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .join("circle")
      .attr("cx", d => x(d.x))
      .attr("cy", d => y(d.y))
      .attr("r", 5)
      .attr("fill", "#69b3a2")
    */
  }

}
