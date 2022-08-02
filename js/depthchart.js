import * as config from './config.js';
import * as mapJS from './map.js';
import * as salJS from './salinity.js'

// set the dimensions and margins of the graph
const margin = { top: 30, right: 0, bottom: 30, left: 50 },
  width = window.innerWidth / 10 * 2 - margin.left - margin.right,
  height = window.innerWidth / 10 * 2 - margin.top - margin.bottom;

var data_long = [];

//Read the data
export function depthchart() {


  var depthdata = sessionStorage.getItem("response");
  depthdata = JSON.parse(depthdata)

  // format the data
  //console.log(result)

  depthdata.forEach(function (d) {

    d.time = new Date(d.time);
    d.Temperature = +d.TSYTemperatrue;
    d.Oxygen = +d.Oxygen;
    d.MS5837Press = +d.MS5837Press;
    d.Pressure = +d.MS5837Press;
    d.Conducitvity = +d.Conducitvity / 1000;
    d.Salinity = salJS.gsw_sp_from_c(+d.Conducitvity, +d.TSYTemperatrue, +d.Pressure);

    //d.Pressure = +d.MS5837Press;
    d.Conducitvity = +d.Conducitvity;

    //shorten data
    for (var prop in d) {
      var a = [prop];
      var y = prop,
        value = +d[prop];
      if (a.some(r => config.dcblacklist.indexOf(r) >= 0)) { continue; }
      if (d.MS5837Press == null || d.Temperature == null || d.MS5837Press == 0 || d.Temperature == 0) { continue; }

      data_long.push({
        y: d.MS5837Press,
        time: d.time,
        value: +value,
        x: y,
        depl: d.deployment
      });

    }

    //console.log(depthdata)



  });
  depthdata = data_long;
  // List of groups (here I have one group per column)
  console.log(depthdata)

  //  console.log(allGroup[Symbol.iterator]().next().value)
  createdepthchart(depthdata)

  function createdepthchart(data) {

    // List of groups (here I have one group per column)
    var allGroup = new Set(data.map(d => d.depl))

    var formatTime = d3.timeFormat("%Y-%m-%d %H:%M");
    // group the data: I want to draw one line per group
    var sumstat = d3.group(data, d => d.x) // nest function allows to group the calculation per level of a factor

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
    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
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

    // draw the first id on loading page
    var dataFilter = data.filter(function (d) { return d.depl == data[0].depl })

    //.domain([d3.min(dataFilter, function (d) { return +d.x; }) * 5 / 6, d3.max(dataFilter, function (d) { return +d.x; }) * 7 / 6])
    /*const x = d3.scaleLinear()
      .domain([d3.min(dataFilter, function (d) { return +d.x; }) * 5 / 6, d3.max(dataFilter, function (d) { return +d.x; }) * 7 / 6])
      .range([0, width]);
    var xAxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(4));
    */
    // Add X axis

    //.domain([d3.min(dataFilter, function (d) { return +d.y; }) * 7 / 6, d3.max(dataFilter, function (d) { return +d.y; }) * 5 / 6])
    var xAxis = svg
      .append("g")
      .attr("transform", `translate(0, ${height}) rotate(-90)`)
      .each(function (d, i) {
        //console.log(d)
        var min = d3.min(d[1], function (d) { return +d.value; })
        var max = d3.max(d[1], function (d) { return +d.value; })
        var x2 = d3.scaleLinear()
          .domain([min * 5 / 6, max * 7 / 6])
          .range([0, width]);
        var svg1 = d3.select(this);

        svg1.call(d3.axisLeft(x2).ticks(6));


      })


    // Add Y axis
    //.domain([d3.min(dataFilter, function (d) { return +d.y; }) * 7 / 6, d3.max(dataFilter, function (d) { return +d.y; }) * 5 / 6])
    var yAxis = svg
      .append("g")
      .each(function (d, i) {
        //console.log(d)
        var min = d3.min(d[1], function (d) { return +d.y; })
        var max = d3.max(d[1], function (d) { return +d.y; })
        var y2 = d3.scaleLinear()
          .domain([min * 7 / 6, max * 5 / 6])
          .range([height, 0]);
        var svg1 = d3.select(this);

        svg1.call(d3.axisLeft(y2).ticks(6));


      })

    var line = svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 1.5)
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

    /*
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
  */
    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
      dataFilter = data.filter(function (d) { return d.depl == selectedGroup })
      //console.log(dataFilter  )
      // Give these new data to update line
      mapJS.setmapview(dataFilter);
      //x.domain([d3.min(dataFilter, function (d) { return +d.x; }) * 5 / 6, d3.max(dataFilter, function (d) { return +d.x; }) * 7 / 6])
      xAxis
        .transition()
        .duration(1000)
        .each(function (d, i) {
          var value = d[1][1].x;
          var dataFilter2 = dataFilter.filter(function (d) { return d.x == value })
          var min = d3.min(dataFilter2, function (d) { return +d.value; })
          var max = d3.max(dataFilter2, function (d) { return +d.value; })
          var y2 = d3.scaleLinear()
            .domain([min * 5 / 6, max * 7 / 6])
            .range([0, width]);
          var svg1 = d3.select(this);

          svg1
            .transition()
            .duration(1000)
            .call(d3.axisLeft(y2).ticks(6));


        })


      // y.domain([d3.max(dataFilter, function (d) { return +d.y; }) * 7 / 6, d3.min(dataFilter, function (d) { return +d.y; }) * 5 / 6])
      yAxis
        .transition()
        .duration(1000)
        .each(function (d, i) {
          //console.log(d)
          var value = d[1][1].x;
          var dataFilter2 = dataFilter.filter(function (d) { return d.x == value })
          var min = d3.min(dataFilter2, function (d) { return +d.y; })
          var max = d3.max(dataFilter2, function (d) { return +d.y; })
          var y2 = d3.scaleLinear()
            .domain([min * 7 / 6, max * 5 / 6])
            .range([height, 0]);
          var svg1 = d3.select(this);

          svg1
            .transition()
            .duration(1000)
            .call(d3.axisLeft(y2).ticks(6));


        })

      /*
      var minutesToAdd=15;
      //console.log(dataFilter[0].time.getTime() -dataFilter[dataFilter.length-1].time.getTime())
      var downcasttime = new Date(dataFilter[0].time.getTime() + minutesToAdd*60000);
      var upcasttime = new Date(dataFilter[dataFilter.length-1].time.getTime() - minutesToAdd*60000);
      line
        .datum(dataFilter)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .defined(function (d) { 

         
             return ((d.time.getTime() > dataFilter[0].time.getTime()  && d.time.getTime() < downcasttime ) || 
             (d.time.getTime() > upcasttime && d.time.getTime() < dataFilter[dataFilter.length-1].time.getTime() ))  })
          .curve(d3.curveBasis)
          .x(d => x(d.x))
          .y(d => y(d.y))
        )
            */
      line
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .transition()
        .duration(1000)
        .attr("d", function (d) {
          //console.log(d);
          var value = d[1][1].x;
          var dataFilter2 = dataFilter.filter(function (d) { return d.x == value })
          //console.log(dataFilter2)
          var min = d3.min(dataFilter2, function (d) { return +d.value; })
          var max = d3.max(dataFilter2, function (d) { return +d.value; })
          var miny = d3.min(dataFilter2, function (d) { return +d.y; })
          var maxy = d3.max(dataFilter2, function (d) { return +d.y; })


          var mapY = d3.scaleLinear()
            .domain([min * 7 / 6, max * 5 / 6])
            .range([0, width])
          var mapX = d3.scaleLinear()
            .domain([miny * 5 / 6, maxy * 7 / 6])
            .range([height, 0])

          var lineGen = d3.line()
            //.defined(function (d) { var i = d.x - diff; diff = d.x; return i <= 300000 && +d.value != 0; })
            //.x(function (d) { return x(d.x); })
            .curve(d3.curveBasis)
            .x(d => {//console.log(mapY(+d.value)); 
              return mapX(+d.value);
            })
            .y(d => {//console.log(mapY(+d.value)); 
              return mapY(+d.y);
            })

            (d[1])
          //console.log(lineGen)
          return lineGen

        })

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
