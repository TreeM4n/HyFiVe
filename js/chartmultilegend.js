import * as config from './config.js';
import * as mapJS from './map.js';
import * as salJS from './salinity.js'


//console.log("chart")
// set the dimensions and margins of the graph 20% x 30% ratio to viewport
const margin = { top: 30, right: 0, bottom: 30, left: 50 },
  width = window.innerWidth / 10 * 2 - margin.left - margin.right,
  height = window.innerWidth / 10 * 2 - margin.top - margin.bottom;

// parse the date / time
//2022-05-12T07:28:47.000Z
//var parseTime = utc.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");
var formatTime = d3.timeFormat("%Y-%m-%d %H:%M:%S");

var sumstat;

/*
function getSalinity (c,t,p) {
  var strUrl = "./php/salinity.php"; var strReturn = "";
  return jQuery.ajax({
    url: strUrl,
    type: "POST",
    datatype: 'json',
    data:  JSON.stringify({c: c,t:t,p:p}),
    success: function(html) {
      console.log(html)
      //strReturn = html;
    },
    async:false
  });
  

}
*/
export function create() {

  var data = sessionStorage.getItem("response");
  data = JSON.parse(data)
  //console.log(data)

  var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
  // format the data
  var data_long = [];

  data.forEach(function (d) {
    //console.log(data)
    //2022-05-12T07:28:47.000Z: delete Z and T and milliS
    d.time = d.time.split("T")[0] + " " + d.time.split("T")[1].split(".")[0]
    d.time = parseTime(d.time);
    d.TSYTemperatrue = +d.TSYTemperatrue;
    d.Temperature = +d.TSYTemperatrue;
    d.Oxygen = +d.Oxygen;
    d.MS5837Press = +d.MS5837Press;
    d.Pressure = +d.MS5837Press;
    d.Conducitvity = +d.Conducitvity;
    d.Salinity = salJS.gsw_sp_from_c(+d.Conducitvity/1000, +d.TSYTemperatrue, +d.Pressure);

    console.log(d.Salinity)
    

    //d.Foo = +d.TSYTemperatrue;


    for (var prop in d) {
      var a = [prop];

      if (a.some(r => config.chartblacklist.indexOf(r) >= 0)) { continue; }
      var y = prop,
        value = +d[prop];

      if (d.time === null || value > 100000 || value < -100000 || value === 0) {
        /*
        d3.select("#ULerror")
          .selectAll('myOptions')
          .data([1])//to generate just one
          .enter()
          .append('li')
          //get start date 
          .text(function (d) { return "value or time overload: " + y + "  value:" + value })
          .style('padding', '4px')
          .style('color', 'orange')
          .attr("value", -1) // corresponding value returned by the button
          */
        continue;

      }
      //threshhold function
      if (config.thresholdProp.indexOf(prop) != -1 && config.thresholdValues[config.thresholdProp.indexOf(prop)][0] != "") {

        if (config.thresholdValues[config.thresholdProp.indexOf(prop)][0] > value
          || config.thresholdValues[config.thresholdProp.indexOf(prop)][1] < value) {
          var timeStorage = formatTime(d.time);

          d3.select("#ULerror")
            .selectAll('myOptions')
            .data([1])//to generate just one
            .enter()
            .append('li')
            //get start date 
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


      data_long.push({
        x: d.time,
        y: y,
        value: +value,
        depl: d.deployment
      });


    }
  });
  data = data_long;
  //console.log("1")
  // add all  options to the list
  var text_node = d3.select("#list")
    .selectAll('allOption')
    .data([1])//to generate just one
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


function createsmallmultiple(data) {
  var diff = 0;
  //console.log(data)
  // group the data: I want to draw one line per group
  sumstat = d3.group(data, d => d.y) // nest function allows to group the calculation per level of a factor
  //console.log(sumstat)
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
  //svg.on("click", function(){console.log("1")})  
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
  // color palette
  /*
          // Set the gradient
          svg.append("linearGradient")
          .attr("id", "line-gradient")
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", 0)
          .attr("y1", y(0))
          .attr("x2", 0)
          .attr("y2", y(max))
          .selectAll("stop")
            .data([
              {offset: "0%", color: "blue"},
              {offset: "100%", color: "red"}
            ])
          .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });
            */
  // Draw the line
  line.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    //.attr("stroke", "url(#line-gradient)" )
    .attr("stroke", function (d) { return config.chartcolor(d[0]) })
    .attr("stroke-width", 1.9)
    .attr("d", function (d) {

      var min = d3.min(d[1], function (d) { return +d.value; })
      var max = d3.max(d[1], function (d) { return +d.value; })

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
      /*
    var lineGen2 = d3.line()
      .x(function (d) { return x(d.x); })
      .y(function (d) {//console.log(y(+d.value));
         return y(+d.value); })
      (d[1])
      
    //console.log(lineGen) */


      return lineGen;

    })




  //-----------------------------------
  // Add the brushing
  line
    .append("g")
    .attr("class", "brush")
    .call(brush);


  // A function that set idleTimeOut to null
  let idleTimeout
  function idled() { idleTimeout = null; }
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


  //-----------------------------------------------------------
   // This allows to find the closest X index of the mouse:
   var bisect = d3.bisector(function(d) { return d.x; }).left;

   // Create the circle that travels along the curve of chart
   var focus = svg
     .append('g')
     .append('circle')
       .style("fill", "none")
       .attr("stroke", "black")
       .attr('r', 8.5)
       .style("opacity", 0)
 
   // Create the text that travels along the curve of chart
   var focusText = svg
     .append('g')
     .append('text')
       .style("opacity", 0)
       .attr("text-anchor", "left")
       .attr("alignment-baseline", "middle")

  // Create a rect on top of the svg area: this rectangle recovers mouse position
  svg
    .append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('width', width)
    .attr('height', height)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);


  // What happens when the mouse move -> show the annotations at the right positions.
  function mouseover() {
    focus.style("opacity", 1)
    focusText.style("opacity",1)
  }

  function mousemove(event, d) {
    // recover coordinate we need
    var x0 = x.invert(d3.pointer(event)[0]);
    var i = bisect(data, x0, 1);
    //console.log(data[i])
    var formatTime = d3.timeFormat("%Y-%m-%d %H:%M:%S");
    var dataFilter = data.filter(function (d) { return formatTime(d.x) == formatTime(data[i].x) })
    //console.log(dataFilter)
    
    focus
      .attr("cx", d3.pointer(event)[0])
      .attr("cy", d3.pointer(event)[1])
    focusText
      .html("y:"+ dataFilter[0].value  )
      .attr("x", d3.pointer(event)[0])
      .attr("y", d3.pointer(event)[1])
      
    }
    
  function mouseout() {
    focus.style("opacity", 0)
    focusText.style("opacity", 0)
  }


/*
  svg.on("mousemove", function (event, d) {
    var time = x.invert(d3.pointer(event)[0]);
    //console.log((d3.pointer(event, this)));
    d3.select("stats").remove();


    var formatTime = d3.timeFormat("%Y-%m-%d %H:%M:%S");
    var dataFilter = data.filter(function (d) { return formatTime(d.x) == formatTime(time) })
    //console.log(dataFilter)
    if (dataFilter.length != 0 && dataFilter) {
      for (var i in dataFilter) {
        // console.log(i)
        // document.getElementById('stats').textContent += dataFilter[i].y + dataFilter[i].y + "\n";


      }

      tooltip = d3.select("#stats")
        .selectAll('myOptions')
        .data([dataFilter])//to generate just one
        .enter()
        .append('li')
        //get start date 
        .text(function (d) {
          return x.invert(d3.pointer(event, this)[0])
          //d[0].y + " was:" + d[0].value 
        })
        .style('padding', '4px')
        .style('color', 'orange')
        .attr("value", -1) // corresponding value returned by the button

      mapJS.showpoint(x.invert(d3.pointer(event)[0]))
    }

  });
*/
  //----------------------------------------------------------------------------------------

  // A function that update the chart for given boundaries after brushing
  function updateChart(event, d) {
    var dataFilter = data;
    // What are the selected boundaries?
    var extent = event.selection;
    // console.log(x.invert(extent[0]))
    //console.log(extent);
    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if (!extent) {
      if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
      //x.domain(d3.extent(data, function(d) { return d.year; }))
      x.range([0, width]);


    } else {

      x.domain([x.invert(extent[0]), x.invert(extent[1])])

      dataFilter = data.filter(function (d) { return d.x >= x.invert(extent[0]) })
      dataFilter = dataFilter.filter(function (d) { return d.x <= x.invert(extent[1]) })
      //datafilter here is broken, shortens the start and end time
      line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done

    }

    // Update axis and line position
    xAxis
      .transition()
      .duration(1000)
      .call(d3.axisBottom(x).ticks(4));


    if (dataFilter != 0) {
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
    }
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
    mapJS.setmapview(dataFilter);

  }


  svg.on("mouseover", function (d) {

    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  })
  //svg.on("mouseover", mousemove)
  //svg.on('mousemove', mousemove)
  svg.on("mouseleave", function (d) {

    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  })


  //---------------mooseover




  // When the button is changed, run the updateChart function
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
            .y(d => {//console.log(mapY(+d.value)); 
              return mapY(+d.value);
            })

            (d[1])

          return lineGen

        })
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
      //console.log(event.explicitOriginalTarget)
    }

  })



}


export function resetCharts() {
  d3.selectAll('svg').remove();
  d3.selectAll('option').remove();
  d3.selectAll('li').remove();

  create();
}


