import * as config from './config.js';
import * as mapJS from './map.js';
import * as salJS from './salinity.js'

/*
script is separated into 3 parts

1. taking data and format it long data form
2. draw elemts (svg, axis, labels etc) and add functionality
3. fucntions to check for clicks and update the element accordingly

*/

// set the dimensions and margins of the graph
const margin = { top: 30, right: 0, bottom: 30, left: 50 },
  width = window.innerWidth / 10 * 2 - margin.left - margin.right,
  height = window.innerWidth / 10 * 2 - margin.top - margin.bottom;

var data_long = [];


//----------------------------------- PART 1 -----------------------------------------
//Read the data
export function depthchart() {


  var depthdata = sessionStorage.getItem("response");
  depthdata = JSON.parse(depthdata)
  var parseTime = d3.utcParse("%Y-%m-%dT%H:%M:%SZ");
  // format the data
  //console.log(result)


  var dataset = [];
  depthdata.forEach(function (d) {

    d.time = parseTime(d.time);
    d.Temperature = +d.TSYTemperatrue;
    d.Oxygen = +d.Oxygen;
    d.MS5837Press = +d.MS5837Press;
    d.Pressure = +d.MS5837Press;
    d.Conductivity = +d.Conducitvity / 1000;
    if(+d.Conducitvity != 0 && +d.TSYTemperatrue!= 0 && +d.Pressure!= 0){
    d.Salinity = salJS.gsw_sp_from_c(+d.Conducitvity / 1000, +d.TSYTemperatrue, +d.Pressure);}
    
    if (d.deployment == 11) {
      dataset.push(Math.ceil(+d.MS5837Press-1030)) 
    }
    
    
    //console.log(+d.Conducitvity / 1000, +d.TSYTemperatrue, +d.Pressure)
    //console.log(d.Salinity)
    

    //d.Pressure = +d.MS5837Press;
    d.Conducitvity = +d.Conducitvity;

    var prevID = 0;
    var castStatus = 0;
    var startStatus;
    var endStatus;
    var times;


    //shorten data
    for (var prop in d) {
      var a = [prop];
      var y = prop,
        value = +d[prop];

      if (a.some(r => config.dcblacklist.indexOf(r) >= 0)) { continue; }
      if (d.MS5837Press == null || d.Temperature == null || d.MS5837Press == 0 || d.Temperature == 0) { continue; }
      //check for deployment changes
      
      if (prevID != d.deployment) {
        prevID = d.deployment;
        times = depthdata.filter(function (d) { return d.deployment == prevID });
        times = (times.map(d => d.deployment))
        // console.log(times)
        startStatus = (times[0]);
        endStatus = parseTime(times[times.length - 1]);

      }
      
      //start and and end is needed to determine id
      if (/*endStatus != null && startStatus != null */ true) {
        //assign status for current element
        //castStatus = getStatus(startStatus.getTime(), endStatus.getTime(), d.time.getTime());
        //castStatus = getStatus2(d.deployment);
        data_long.push({
          y: d.MS5837Press,
          time: d.time,
          value: +value,
          x: y,
          depl: d.deployment,
          status: 1
        });
      }
    }

    //console.log(depthdata)



  });
  depthdata = data_long;
  const changePoints = detectChangePoints(dataset);
  console.log(changePoints); // Output: [3, 6, 9, 11]


  // List of groups (here I have one group per column)
  //console.log(depthdata)

  //  console.log(allGroup[Symbol.iterator]().next().value)
  createdepthchart(depthdata)
}
//---------------------------------------- PART 2 -----------------------------------------------------
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

  // draw the first id on loading page but only the axis so on select a chart does not pop off out of nowhere
  var dataFilter = data.filter(function (d) { return d.depl == data[0].depl })

  // Add X axis

  var xAxis = svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .each(function (d, i) {
      var min = d3.min(d[1], function (d) { return +d.value; })
      var max = d3.max(d[1], function (d) { return +d.value; })
      var x2 = d3.scaleLinear()
        .domain([min * 5 / 6, max * 7 / 6])
        .range([0, width]);
      var svg1 = d3.select(this);

      svg1.call(d3.axisBottom(x2).ticks(6));


    })


  // Add Y axis

  var yAxis = svg
    .append("g")
    .each(function (d, i) {
      var min = d3.min(d[1], function (d) { return +d.y; })
      var max = d3.max(d[1], function (d) { return +d.y; })
      var y2 = d3.scaleLinear()
        .domain([max * 7 / 6, min * 5 / 6])
        .range([height, 0]);
      var svg1 = d3.select(this);

      svg1.call(d3.axisLeft(y2).ticks(6));


    })
  // 3 seperate lines for up down and mid
  var lineupC = svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "#69b3a2")
    .attr("stroke-width", 1.5)
    .attr("class", "up")

  var linedownC = svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "#69b3a2")
    .attr("stroke-width", 1.5)
    .attr("class", "down")

  var linemidC = svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "#69b3a2")
    .attr("stroke-width", 1.5)
    .attr("class", "mid")

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


  //---------------------------------------------- PART 3 ----------------------------------------------------
  // A function that updates the chart
  function update(selectedGroup) {

    // Create new data with the selection?
    dataFilter = data.filter(function (d) { return d.depl == selectedGroup })
    //console.log(dataFilter  )
    // Give these new data to update map
    mapJS.setmapview(dataFilter);
    //update xAxis
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
          .call(d3.axisBottom(y2).ticks(6));


      })


    //update yAxis
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
          .domain([max * 7 / 6, min * 5 / 6])
          .range([height, 0]);
        var svg1 = d3.select(this);

        svg1
          .transition()
          .duration(1000)
          .call(d3.axisLeft(y2).ticks(6));


      })
    // leaving this in since its another easy up and downcast detector based on time
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
    //update lines
    linedownC

      .attr("fill", "none")
      .attr("stroke", "#ea6c15") //orange
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
          .domain([maxy * 7 / 6, miny * 5 / 6])
          .range([height, 0])
        var mapX = d3.scaleLinear()
          .domain([min * 5 / 6, max * 7 / 6])
          .range([0, width])

        var lineGen = d3.line()
          .defined(function (d) { return d.x == value && d.depl == selectedGroup && d.value != 0 && d.status == 1; })
          //.x(function (d) { return x(d.x); })
          .curve(d3.curveBasis)
          .x(d => {
            //console.log(mapY(+d.value));
            return mapX(+d.value);
          })
          .y(d => {//console.log(mapY(+d.value)); 
            return mapY(+d.y);
          })

          (d[1])
        //console.log(lineGen)
        return lineGen

      })


    linemidC

      .attr("fill", "none")
      .attr("stroke", "#3bbe2c") //posion green
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
          .domain([maxy * 7 / 6, miny * 5 / 6])
          .range([height, 0])
        var mapX = d3.scaleLinear()
          .domain([min * 5 / 6, max * 7 / 6])
          .range([0, width])

        var lineGen = d3.line()
          .defined(function (d) { return d.x == value && d.depl == selectedGroup && d.value != 0 && d.status == 2; })
          //.x(function (d) { return x(d.x); })
          .curve(d3.curveBasis)
          .x(d => {
            //console.log(mapY(+d.value));
            return mapX(+d.value);
          })
          .y(d => {//console.log(mapY(+d.value)); 
            return mapY(+d.y);
          })

          (d[1])
        //console.log(lineGen)
        return lineGen

      })


    lineupC

      .attr("fill", "none")
      .attr("stroke", "#2c2ebe ") // blue
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
          .domain([maxy * 7 / 6, miny * 5 / 6])
          .range([height, 0])
        var mapX = d3.scaleLinear()
          .domain([min * 5 / 6, max * 7 / 6])
          .range([0, width])

        var lineGen = d3.line()
          .defined(function (d) { return d.x == value && d.depl == selectedGroup && d.value != 0 && d.status == 3; })
          //.x(function (d) { return x(d.x); })
          .curve(d3.curveBasis)
          .x(d => {
            //console.log(mapY(+d.value));
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



  // When the list is changed, run the updateChart function
  d3.select("#list").on("click", function (event, d) {
    // recover the option that has been chosen
    const selectedOption = event.explicitOriginalTarget.value

    if (selectedOption == -1) {
      // do nothing for description
    }
    else {
      // run the updateChart function with this selected option
      update(selectedOption)

    }

  })

}


//returns based on minute difference 1 to 3 where: 1 = downcast, 2 = horicantal profile and 3 = upcast
var diffMin = 60000 * 10; //millisec 
function getStatus(start, end, current) {
  if (current - start < diffMin) { return 1; }
  else if (end - current < diffMin) { return 3; }
  else { return 2; }
  //console.log(start,end,current)

}
// first 10 always down adn up , after that 
var deployStatus=0;
var dataStatus= [];
function getStatus2(deployment, value) {
  if(deployment!=deployStatus) {
    deployStatus = deployment
    dataStatus = [];
    return 1;
  }
  else if (dataStatus.length < 120) {
    
    dataStatus.push(value);
    return 1;
  }
  else if (true) {

  }
  else {

  }
  
  

}

//------------------------------------ cast toggles---------------------
// its ugly and it works
// adjust states of all toggles and corresponding lines based on old state
document.getElementById("s1").checked = true;
document.getElementById("s2").checked = false;
document.getElementById("s3").checked = false;
document.getElementById("s4").checked = false;

d3.select("#s1").on("click", function (event, d) {
  var x;
  var i;

  if (document.getElementById("s1").checked) {
    try {
      x = document.getElementsByClassName("up");

      for (i = 0; i < x.length; i++) {
        x[i].classList.remove("hidden");
        
      }
      x = document.getElementsByClassName("down");

      for (i = 0; i < x.length; i++) {
        x[i].classList.remove("hidden");
      }
      x = document.getElementsByClassName("mid");

      for (i = 0; i < x.length; i++) {
        x[i].classList.remove("hidden");
      }
    } catch (error) {
      
    }
    

    document.getElementById("s2").checked = false;
    document.getElementById("s3").checked = false;
    document.getElementById("s4").checked = false;

  }
  else {
    x = document.getElementsByClassName("up");

    for (i = 0; i < x.length; i++) {
      x[i].classList.add("hidden");
      
    }
    x = document.getElementsByClassName("down");

    for (i = 0; i < x.length; i++) {
      x[i].classList.add("hidden");
    }
    x = document.getElementsByClassName("mid");

    for (i = 0; i < x.length; i++) {
      x[i].classList.add("hidden");
    }
  }

})
d3.select("#s2").on("click", function (event, d) {
  var x;
  var i;
  if (document.getElementById("s2").checked) {
    if (document.getElementById("s1").checked) {
      document.getElementById("s1").checked = false;
      document.getElementById("s3").checked = false;
      document.getElementById("s4").checked = false;
      
      x = document.getElementsByClassName("up");

      for (i = 0; i < x.length; i++) {
        x[i].classList.toggle("hidden");
      }

      x = document.getElementsByClassName("mid");
      for (i = 0; i < x.length; i++) {
        x[i].classList.toggle("hidden");
      }
    }
    x = document.getElementsByClassName("down");
    for (i = 0; i < x.length; i++) {
      x[i].classList.remove("hidden");
    }
  }
  else {
    x = document.getElementsByClassName("down");
    for (i = 0; i < x.length; i++) {
      x[i].classList.add("hidden");
    }

  }
})
d3.select("#s3").on("click", function (event, d) {
  var x;
  var i;
  if (document.getElementById("s3").checked) {
    if (document.getElementById("s1").checked) {
      document.getElementById("s1").checked = false;
      document.getElementById("s2").checked = false;
      document.getElementById("s4").checked = false;
      
      x = document.getElementsByClassName("up");

      for (i = 0; i < x.length; i++) {
        x[i].classList.toggle("hidden");
      }

      x = document.getElementsByClassName("down");
      for (i = 0; i < x.length; i++) {
        x[i].classList.toggle("hidden");
      }
    }
    x = document.getElementsByClassName("mid");
    for (i = 0; i < x.length; i++) {
      x[i].classList.remove("hidden");
    }
  }
  else {
    x = document.getElementsByClassName("mid");
    for (i = 0; i < x.length; i++) {
      x[i].classList.add("hidden");
    }

  }
})
d3.select("#s4").on("click", function (event, d) {
  var x;
  var i;
  if (document.getElementById("s4").checked) {
    if (document.getElementById("s1").checked) {
      document.getElementById("s1").checked = false;
      document.getElementById("s3").checked = false;
      document.getElementById("s2").checked = false;
      
      x = document.getElementsByClassName("down");

      for (i = 0; i < x.length; i++) {
        x[i].classList.toggle("hidden");
      }

      x = document.getElementsByClassName("mid");
      for (i = 0; i < x.length; i++) {
        x[i].classList.toggle("hidden");
      }
    }
    x = document.getElementsByClassName("up");
    for (i = 0; i < x.length; i++) {
      x[i].classList.remove("hidden");
    }
  }
  else {
    x = document.getElementsByClassName("up");
    for (i = 0; i < x.length; i++) {
      x[i].classList.add("hidden");
    }

  }
})



function detectChangePoints(dataset) {

  try {
    const changePoints = [];
    console.log(dataset)
  
    // Calculate the mean of the dataset
    const mean = dataset.reduce((sum, value) => sum + value) / dataset.length;
    console.log(mean)
  
    // Calculate the standard deviation of the dataset
    const standardDeviation = Math.sqrt(
      dataset.reduce((sum, value) => sum + Math.pow(value - mean, 2)) / dataset.length
    );
    console.log(standardDeviation)
  
    // Determine the threshold for change detection
    const threshold = standardDeviation * 1; // Adjust the multiplier as needed

    var n = 10;
    // Iterate over the dataset and detect change points
    for (let i = 1; i < dataset.length - 1; i = i+ n) {
      const current = dataset[i];
      const prev = dataset[i - n];
      const next = dataset[i + n];
  
      // Detect change point if the absolute difference between current and previous value
      // is greater than the threshold
      console.log(Math.abs(current - prev))
      console.log(Math.abs(current - next))
      if (Math.abs(current - prev) > threshold ) {
        changePoints.push(i);
      }
  
      // Detect change point if the absolute difference between current and next value
      // is greater than the threshold
      else if(Math.abs(current - next) > threshold) {
        changePoints.push(i);
      }
    }
  
    return changePoints;
  } catch (error) {
    console.log (error)
    return false;
  }
}