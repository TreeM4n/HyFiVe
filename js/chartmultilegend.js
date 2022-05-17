// set the dimensions and margins of the graph
const margin = {top: 30, right: 0, bottom: 30, left: 50},
    width = 210 - margin.left - margin.right,
    height = 210 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y");

//Read the data
d3.csv("./data/data2.csv").then( function(data) {

  // format the data
  data.forEach(function(d) {
      d.year = parseTime(d.year);
 

  });

  // group the data: I want to draw one line per group
  const sumstat = d3.group(data, d => d.name) // nest function allows to group the calculation per level of a factor
  


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
            `translate(${ margin.left },${margin.top})`);

  // Add X axis --> it is a date format
  const x = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.year; }))
    .range([ 0, width ]);
  xAxis = svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(4));

  //Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.n; })])
    .range([ height, 0 ]);
  yAxis = svg.append("g")
    .call(d3.axisLeft(y).ticks(5));

     // Add a clipPath: everything out of this area won't be drawn.
    const clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

         // Add brushing
    const brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the line variable: where both the line and the brush take place
    const line = svg.append('g')
      .attr("clip-path", "url(#clip)")
  // color palette
  const color = d3.scaleOrdinal()
    //.domain(allKeys)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

  // Draw the line
  line.append("path")
  .attr("class","line")
      .attr("fill", "none")
      .attr("stroke", function(d){ return color(d[0]) })
      .attr("stroke-width", 1.9)
      .attr("d", function(d){
        return d3.line()
          .x(function(d) { return x(d.year); })
          .y(function(d) { return y(+d.n); })
          (d[1])
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
    .text(function(d){ return(d[0])})
    .style("fill", function(d){ return color(d[0]) })
// A function that update the chart for given boundaries
    function updateChart(event,d) {

      // What are the selected boundaries?
      extent = event.selection;
      //console.log(extent);
      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if(!extent){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        //x.domain(d3.extent(data, function(d) { return d.year; }))
        x.range([ 0, width ]);
        
        
      }else{
          
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
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
            .attr("d", function(d){
             return d3.line()
             .x(function(d) { return x(d.year); })
             .y(function(d) { return y(+d.n); })
             (d[1])
     
            
            })
    }

    // If user double click, reinitialize the chart
    svg.on("dblclick",function(){
      x.domain(d3.extent(data, function(d) { return d.year; }))
      xAxis.transition().call(d3.axisBottom(x))
      xAxis.call(d3.axisBottom(x).ticks(4));
      line
        .select('.line')
        .transition()
      .attr("d", function(d){
        return d3.line()
          .x(function(d) { return x(d.year); })
          .y(function(d) { return y(+d.n); })
          (d[1])
     
      })
    });  
})
