// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 50, left: 60},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// parse the date / time
var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
// --------------------------------line scale
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
      .attr("d", valueline)
      .attr("id", "TSYTemperatrue");

  // Add the valueline2 path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "blue")
      .attr("id", "Oxygen")
      .attr("d", valueline2);

 // Add the valueline3 path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("id", "MS5837Press")
      .style("stroke", "black")
      .attr("d", valueline3);

 // Add the valueline4 path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("id", "Conducitvity")
      .style("stroke", "green")
      .attr("d", valueline4);
    //console.log(data.Conducitvity)

  //----------------------------------add axis
  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
      

  // Add the Y0 Axis
  svg.append("g")
      .attr("class", "axisRed")
      .call(d3.axisLeft(y0))
      .attr("id", "TSYTemperatrueAxis");

  // Add the Y1 Axis
  svg.append("g")
      .attr("class", "axisSteelBlue")
      .attr("transform", "translate( " + width + ", 0 )")
      .call(d3.axisRight(y1))
      .attr("id", "OxygenAxis");

  // Add the Y2 Axis
  svg.append("g")
      .attr("class", "axisBlack")
      .call(d3.axisRight(y2))
      .attr("id", "MS5837PressAxis");

  // Add the Y3 Axis
  svg.append("g")
      .attr("class", "axisGreen")
      .attr("transform", "translate( " + width + ", 0 )")
      .call(d3.axisLeft(y3))
      .attr("id", "ConducitvityAxis");

  //------------------------------------ add legends with toggle
  //number variables
  
  legendSpace = width/5;

    svg.append("text")
          .attr("x", (legendSpace/2)+0*legendSpace)  // space legend
          .attr("y", height + (margin.bottom/2)+ 20)
          .attr("class", "legend")    // style the legend
          .style("fill","red")
          .attr("id", "TTSYTemperatrueLabel")
          .on("click", function(){
              // Determine if current line is visible 
              var active   = TSYTemperatrue.active ? false : true,
              newOpacity = active ? 0.2 : 1; 
              //console.log("true");
              // Hide or show the elements based on the ID
              d3.select("#TSYTemperatrue").style("opacity", newOpacity);
              d3.select("#TSYTemperatrueAxis").style("opacity", newOpacity);
              d3.select("#TTSYTemperatrueLabel").style("opacity", newOpacity);
                  
              // Update whether or not the elements are active
              TSYTemperatrue.active = active;
              })  
          .text("Tempature"); 

    svg.append("text")
          .attr("x", (legendSpace/2)+1*legendSpace)  // space legend
          .attr("y", height + (margin.bottom/2)+ 20)
          .attr("class", "legend")    // style the legend
          .style("fill","SteelBlue")
          .attr("id", "OxygenLabel")
          .on("click", function(){
              // Determine if current line is visible 
              var active   = Oxygen.active ? false : true,
              newOpacity = active ? 0.2 : 1; 
              //console.log("true");
              // Hide or show the elements based on the ID
              d3.select("#Oxygen").style("opacity", newOpacity);
              d3.select("#OxygenAxis").style("opacity", newOpacity);
              d3.select("#OxygenLabel").style("opacity", newOpacity);
                  
              // Update whether or not the elements are active
              Oxygen.active = active;
              })  
          .text("Oxygen"); 

    svg.append("text")
          .attr("x", (legendSpace/2)+2*legendSpace)  // space legend
          .attr("y", height + (margin.bottom/2)+ 20)
          .attr("class", "legend")    // style the legend
          .style("fill","black")
          .attr("id", "MS5837PressLabel")
          .on("click", function(){
              // Determine if current line is visible 
              var active   = MS5837Press.active ? false : true,
              newOpacity = active ? 0.2 : 1; 
              //console.log("true");
              // Hide or show the elements based on the ID
              d3.select("#MS5837Press").style("opacity", newOpacity);
              d3.select("#MS5837PressAxis").style("opacity", newOpacity);
              d3.select("#MS5837PressLabel").style("opacity", newOpacity);
                  
              // Update whether or not the elements are active
              MS5837Press.active = active;
              })  
          .text("Pressure"); 

    svg.append("text")
          .attr("x", (legendSpace/2)+3*legendSpace)  // space legend
          .attr("y", height + (margin.bottom/2)+ 20)
          .attr("class", "legend")    // style the legend
          .style("fill","green")
          .attr("id", "ConducitvityLabel")
          .on("click", function(){
              // Determine if current line is visible 
              var active   = Conducitvity.active ? false : true,
              newOpacity = active ? 0.2 : 1; 
              //console.log("true");
              // Hide or show the elements based on the ID
              d3.select("#Conducitvity").style("opacity", newOpacity);
              d3.select("#ConducitvityAxis").style("opacity", newOpacity);
              d3.select("#ConducitvityLabel").style("opacity", newOpacity);
                  
              // Update whether or not the elements are active
              Conducitvity.active = active;
              })  
          .text("Conductivity"); 
    
    //valuesbytime = d3.group(data,d=> d.Time);
    //console.log(valuesbytime);
})
