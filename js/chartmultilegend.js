// set the dimensions and margins of the graph
const margin = { top: 30, right: 0, bottom: 30, left: 50 },
  width = 210 - margin.left - margin.right,
  height = 210 - margin.top - margin.bottom;

// parse the date / time
//2022-05-12T07:28:47.000Z
var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");

create();

function create() {
  $.ajax({
    url: "./php/dummyquery.php",    //the page containing php script
    type: "post",    //request type,
    dataType: 'json',
    data: {},
    success: function result(result) {

      data = result;

      var blacklist = ["TSYTemperatrue", "MS5837Press", "time", "deployment", "MS5837Temperature",
        "MS5837Press", "Longitude", "Latitude", "Speed", "Course"]

      // format the data
      var data_long = [];
      data.forEach(function (d) {
        //2022-05-12T07:28:47.000Z: delete Z and T and milliS
        d.time = d.time.split("T")[0] + " " + d.time.split("T")[1].split(".")[0]
        d.time = parseTime(d.time);
        d.TSYTemperatrue = +d.TSYTemperatrue;
        d.Temperature = +d.TSYTemperatrue;
        d.Oxygen = +d.Oxygen;
        d.MS5837Press = +d.MS5837Press;
        d.Pressure = +d.MS5837Press;
        d.Conducitvity = +d.Conducitvity;


        for (prop in d) {
          var a = [prop];
          if (a.some(r => blacklist.indexOf(r) >= 0)) { continue; }
          var y = prop,
            value = +d[prop];

          data_long.push({
            x: d.time,
            y: y,
            value: +value
          });

        }
        //cheat
        data = data_long;

      });
      createsmallmultiple(data)
      function createsmallmultiple(data) {
        // console.log(data_long)
        // group the data: I want to draw one line per group
        const sumstat = d3.group(data, d => d.y) // nest function allows to group the calculation per level of a factor
        //console.log(sumstat)


        // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
        const svg = d3.select("#my_dataviz")
          .selectAll("uniqueChart")
          .data(sumstat)
          .enter()
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform",
            `translate(${margin.left},${margin.top})`);

        // Add X axis --> it is a date format
        const x = d3.scaleTime()
          .domain(d3.extent(data, function (d) { return d.x; }))
          .range([0, width]);
        xAxis = svg
          .append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(d3.axisBottom(x).ticks(4));

        //Add Y axis

        var y = d3.scaleLinear()
          /*.domain([0, d3.max(sumstat, function (d) { 
            for (prop in d) {
              console.log(+d[prop]);
              return +d[prop]; }})])
              */
          //.domain([0, d3.max(sumstat, function (d) {console.log(+d.value); return +d.value; })])
          .domain([0, d3.max(data, function (d) { return 2000; })])
          .range([height, 0]);

        yAxis = svg
          .append("g")
          .each(function (d, i) {
            //console.log(d)
            var min = d3.min(d[1], function (d) { return +d.value; })
            var max = d3.max(d[1], function (d) { return +d.value; })
            var y2 = d3.scaleLinear()
              .domain([min*5/6, max*7/6])
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
        const color = d3.scaleOrdinal()
          //.domain(allKeys)
          .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])

        // Draw the line
        line.append("path")
          .attr("class", "line")
          .attr("fill", "none")
          .attr("stroke", function (d) { return color(d[0]) })
          .attr("stroke-width", 1.9)
          .attr("d", function (d) {
            
            var min = d3.min(d[1], function (d) { return +d.value;})
            var max = d3.max(d[1], function (d) { return +d.value; })

            var mapY = d3.scaleLinear()
            .domain([min*5/6, max*7/6])
            .range([height, 0])

            var lineGen = d3.line()
            .x(function (d) { return x(d.x); })
            .y(d=> {console.log(mapY(+d.value)); 
              return mapY(+d.value);})
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
          .text(function (d) { return (d[0]) })
          .style("fill", function (d) { return color(d[0]) })
        // A function that update the chart for given boundaries
        function updateChart(event, d) {

          // What are the selected boundaries?
          extent = event.selection;
          //console.log(extent);
          // If no selection, back to initial coordinate. Otherwise, update X axis domain
          if (!extent) {
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            //x.domain(d3.extent(data, function(d) { return d.year; }))
            x.range([0, width]);


          } else {

            x.domain([x.invert(extent[0]), x.invert(extent[1])])
            //x.domain(d3.extent(data, function(d) { return d.year; }))
            line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done

          }

          // Update axis and line position
          xAxis.transition().duration(1000).call(d3.axisBottom(x))
          xAxis.call(d3.axisBottom(x).ticks(4));
          line
            .select('.line')
            .transition()
            .duration(1000)
            .attr("d", function (d) {

              var min = d3.min(d[1], function (d) { return +d.value;})
              var max = d3.max(d[1], function (d) { return +d.value; })
  
              var mapY = d3.scaleLinear()
              .domain([min*5/6, max*7/6])
              .range([height, 0])
  
              var lineGen = d3.line()
              .x(function (d) { return x(d.x); })
              .y(d=> {console.log(mapY(+d.value)); 
                return mapY(+d.value);})
              (d[1])

              return lineGen

            })
        }

        // If user double click, reinitialize the chart
        svg.on("dblclick", function () {

          //data gets overriden by result = data in map.js need fix 

          x.domain(d3.extent(data, function (d) { ; return d.x; }))
          xAxis.transition().call(d3.axisBottom(x))
          xAxis.call(d3.axisBottom(x).ticks(4));
          line
            .select('.line')
            .transition()
            .attr("d", function (d) {
              
              var min = d3.min(d[1], function (d) { return +d.value;})
              var max = d3.max(d[1], function (d) { return +d.value; })
  
              var mapY = d3.scaleLinear()
              .domain([min*5/6, max*7/6])
              .range([height, 0])
  
              var lineGen = d3.line()
              .x(function (d) { return x(d.x); })
              .y(d=> {console.log(mapY(+d.value)); 
                return mapY(+d.value);})
              (d[1])

              return lineGen

            })
        });
      }
    }
  });
}
/*
//Read the data
d3.csv("./data/data2.csv").then(function (data) {
  // format the data
  data.forEach(function (d) {
    d.year = parseTime(d.year);
  });
  // group the data: I want to draw one line per group
  const sumstat = d3.group(data, d => d.name) // nest function all
  //ows to group the calculation per level of a factor
  console.log(sumstat)
})
*/