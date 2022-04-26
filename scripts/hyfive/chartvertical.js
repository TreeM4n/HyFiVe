// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("./data/data.csv",

  // When reading the csv, I must format variables:
  function(d){
    // formats : https://github.com/d3/d3-time-format
    //return { Time : d3.timeParse("%Y-%m-%d %H:%M:%S") (d.Time), MS5837Temperature : d.MS5837Temperature }
    return { Pressure : d.MS5837Press, Temperature : d.MS5837Temperature }
  }).then(

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.MS5837Temperature; })])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));
    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Celsius");
      

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.MS5837Press; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Pressure");
      
      console.log(data)
    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.MS5837Temperature) })
        .y(function(d) { return y(d.MS5837Press) })
        )

})