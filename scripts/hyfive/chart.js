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
/*
//Read the data
d3.csv("./data/data.csv",

  // When reading the csv, I must format variables:
  function(d){
    // formats : https://github.com/d3/d3-time-format
    return { Time : d3.timeParse("%Y-%m-%d %H:%M:%S") (d.Time), TSYTemperatrue : d.TSYTemperatrue,MS5837Temperature :d.MS5837Temperature}
  }).then(

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.Time; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));
    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Time");
      
    /*
    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.TSYTemperatrue; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Temperature");
    
    // Add Y2 axis
    const y2 = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.MS5837Temperature; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y2));
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Temp2");
      
      //console.log(data)
    // Add the line
    /*
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("class", "line")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.Time) })
        .y(function(d) { return y(d.TSYTemperatrue) })
        )
    
    svg.append("path")
      .datum(data)
      .attr("fill", "red")
      .attr("class", "line")
      .attr("stroke", "red")
      .attr("stroke-width", 1.5)
      .attr("transform", "translate( " + width + ", 0 )")
      .attr("d", d3.line()
        .x(function(d) { return x(d.Time) })
        .y(function(d) { return y2(d.MS5837Temperature) })
        )
      */
   // parse the date / time
var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
// --------------------------------legend scale
// set the ranges
var x = d3.scaleTime().range([0, width]);
var y0 = d3.scaleLinear().range([height, 0]);
var y1 = d3.scaleLinear().range([height, 0]);
var y2 = d3.scaleLinear().range([height, 0]);
var y3 = d3.scaleLinear().range([height, 0]);

//---------------------------------line define
// define the 1st line
var valueline = d3.line()
    .x(function(d) { return x(d.Time); })
    .y(function(d) { return y0(d.TSYTemperatrue); });

// define the 2nd line
var valueline2 = d3.line()
    .x(function(d) { return x(d.Time); })
    .y(function(d) { return y1(d.Oxygen); });

// define the 3nd line
var valueline3 = d3.line()
    .x(function(d) { return x(d.Time); })
    .y(function(d) { return y2(d.MS5837Press); });

// define the 4nd line
var valueline4 = d3.line()
    .x(function(d) { return x(d.Time); })
    .y(function(d) { return y3(d.Conducitvity); });

// Get the data
d3.csv("./data/data.csv").then(function(data) {

  // format the data
  data.forEach(function(d) {
      d.Time = parseTime(d.Time);
      d.TSYTemperatrue = +d.TSYTemperatrue;
      d.Oxygen = +d.Oxygen;
      d.MS5837Press = +d.MS5837Press;
      d.Conducitvity = +d.Conducitvity;
  });
  

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.Time; }));
  y0.domain([0, d3.max(data, function(d) {return Math.max(d.TSYTemperatrue);})]); //rot
  y1.domain([0, d3.max(data, function(d) {return Math.max(d.Oxygen); })]);  //blau
  y2.domain([0, d3.max(data, function(d) {return Math.max(d.MS5837Press); })]); //schwarz
  y3.domain([0, d3.max(data, function(d) {return Math.max(d.Conducitvity); })]); //grün


  

  //------------------------------------create lines 
  
  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "red")
      .attr("d", valueline);

  // Add the valueline2 path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      
      .attr("d", valueline2);

 // Add the valueline3 path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "green")
      .attr("d", valueline3);

 // Add the valueline4 path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "orange")
      .attr("d", valueline4);
    //console.log(data.Conducitvity)

  //------------------------------------legend
  //number variables
  legendSpace = width/4;

    svg.append("text")
          .attr("x", (legendSpace/2)+legendSpace)  // space legend
          .attr("y", height + (margin.bottom/2)+ 5)
          .attr("class", "legend")    // style the legend
          .style("fill","orange")
          .on("click", function(){
              // Determine if current line is visible 
              var active   = d.active ? false : true,
              newOpacity = active ? 0 : 1; 
              console.log("true");
              // Hide or show the elements based on the ID
              d3.select(d.Oxygen)
                  .transition().duration(100) 
                  .style("opacity", newOpacity); 
              // Update whether or not the elements are active
              d.active = active;
              })  
          .text("Oxygen"); 
  //----------------------------------add axis
  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));


  // Add the Y0 Axis
  svg.append("g")
      .attr("class", "axisSteelBlue")
      .call(d3.axisLeft(y0));

  // Add the Y1 Axis
  svg.append("g")
      .attr("class", "axisRed")
      .attr("transform", "translate( " + width + ", 0 )")
      .call(d3.axisRight(y1));

  // Add the Y2 Axis
  svg.append("g")
      .attr("class", "axisGreen")
      .call(d3.axisRight(y2));

  // Add the Y3 Axis
  svg.append("g")
      .attr("class", "axisOrange")
      .attr("transform", "translate( " + width + ", 0 )")
      .call(d3.axisLeft(y3));

})
