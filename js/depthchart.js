

// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 60 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
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

depthchart();
//Read the data
function depthchart() {

  $.ajax({
    url: "./php/dummyquery.php",    //the page containing php script
    type: "post",    //request type,
    dataType: 'json',
    data: {},
    success: function result(result) {

      depthdata = result;

      var blacklist = ["TSYTemperatrue", "MS5837Press", "time", "deployment", "MS5837Temperature",
        "MS5837Press", "Longitude", "Latitude", "Speed", "Course", "Oxygen", "Conducitvity"]

      // format the data


      depthdata.forEach(function (d) {
        //2022-05-12T07:28:47.000Z: delete Z and T and milliS
        d.time = d.time.split("T")[0] + " " + d.time.split("T")[1].split(".")[0]
        d.time = parseTime(d.time);
        d.TSYTemperatrue = +d.TSYTemperatrue;
        d.Temperature = +d.TSYTemperatrue;
        d.Oxygen = +d.Oxygen;
        d.MS5837Press = +d.MS5837Press;
        //d.Pressure = +d.MS5837Press;
        d.Conducitvity = +d.Conducitvity;

        //shorten data
        for (prop in d) {
          var a = [prop];
          if (a.some(r => blacklist.indexOf(r) >= 0)) { continue; }

          var y = prop,
            value = +d[prop];

          data_long.push({
            y: d.MS5837Press,
            time: d.time,
            x: +value
          });

        }
        //cheat

        depthdata = data_long;


      });

      console.log(data_long)
      createdepthchart(depthdata)

      function createdepthchart(data) {

        const x = d3.scaleLinear()
          .domain(d3.extent(data, d => d.x))
          .range([0, width]);
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
        // Add Y axis
        const y = d3.scaleLinear()
          .domain([d3.min(data, function (d) { return +d.y; }) * 5/6, d3.max(data, function (d) { return +d.y; }) *7/6])
          .range([height, 0]);
        svg.append("g")
          .call(d3.axisLeft(y));
        // Add the line
        svg.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "#69b3a2")
          .attr("stroke-width", 1.5)
          .attr("d", d3.line()
            .curve(d3.curveBasis)
            .x(d => x(d.x))
            .y(d => y(d.y))
          )
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
  })
};