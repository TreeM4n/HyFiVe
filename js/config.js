//------------MAIN PAGE--------------------------------
// "now - initialhours":start date of query 
export var  initialhours = 48;


//------------MULTIPLECHARTS-----------------------
// values that should not get an chart / or are renamed and therefore double
export var chartblacklist = ["TSYTemperatrue", "MS5837Press", "time", "deployment", "MS5837Temperature",
"MS5837Press", "Longitude", "Latitude", "Speed", "Course"]

// begins at start if no more are declared
export const chartcolor = d3.scaleOrdinal()
//.domain(allKeys)
.range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])



// for threshhold and labeling
// ----------------!IMPORTANT all arrays need the same length with at least empty strings-------------------------------
// name / property
export var thresholdProp = ["Temperature","Pressure","Conducitvity","Oxygen","Salinity"]
// in order the thresholds
export var thresholdValues = [["-20","18"],["",""],["",""],["",""],["",""]] 
// in order the units
export var thresholdUnits = [["'C"],["mbar"],["mS/cm"],["\u00B5g/L"],["g/kg"]] 

// \u00B5S = mycro


//------MAP-------
// values that dont matter for the map
export var mapblacklistmap = ["TSYTemperatrue", "MS5837Press", "time", "deployment", "MS5837Temperature",
  "MS5837Press", "Speed", "Course", "Latitude", "Oxygen", "Longitude"]

// variable for not drawing line in minutes 
export var MapDim = 2
//every n'th mappoint is not drawn
export var MapPoints = 2;


//---------DEPTHCHART-------------------
//values which arent important for dephtchart
export var dcblacklist = ["TSYTemperatrue", "MS5837Press", "deployment","time", "MS5837Temperature",
"MS5837Press", "Longitude", "Latitude", "Speed", "Course", "Oxygen", "Conducitvity"]
