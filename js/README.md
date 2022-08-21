# Function list in JS folder 
# main.js
contains several function regarding query and sesssion storage \

## initial()

is executed on page load and sets start and stop values of datepicker in the left corner\
furthermore initialyzes if necessary initialquery() \
otherwise also executes create() in chartmultilegend and mapfnc() in map.js\

## initialquery()
calls query() in jsquery.js and reforms data recieved to tidy data form \

## reload() 
listen to show button otherwise identical to initialquery() \



# maindepth.js
identical in functionality to main.js but tuned to depthchart.html\

## initial()

is executed on page load and sets start and stop values of datepicker in the left corner\
furthermore initialyzes if necessary initialquery() \
otherwise also executes depthchart() in depthchart.js and mapfnc() in map.js\

## initialquery()
calls query() in jsquery.js and reforms data recieved to tidy data form \

## reload() 
listen to show button otherwise identical to initialquery() \


# chartmultilegend.js
responsible for data manipulation to generate all horizantal charts \

## create()
responsible for formatting data from tidy to long form \
calls createsmallmultiple() \

## createsmallmultiple()

creates the svg for each parameter and calculates axis and lines for an "all selection" \
adds option to the list of deployment IDs \

## updatechart()

update function for charts after brushing \

## updateChart2()

updates charts upon selecting an ID in the list \

## "event function"
function bound to the event selection of ID inside the list \
unnamed function to update chart when selecting an ID  and determine which case it is : show all, show id, missclicked \
updates charts upon selecting show all  and calls map.removemarker()\


## reseCharts()

removes all svg.charts, option inside the list and elements generated \


# depthchart.js

similiar structure and fucntion to chartmultilegend.js but for horizontal charts \

## depthchart()

similiar to create() in chartmultilegend.js \
formats data from tidy to long form \
determine which "cast section" each value is from \
calls   createdepthchart() \

##   createdepthchart()
similiar to create() in chartmultilegend.js \
creates the svg for each parameter \
does not draw a line but axis in reference to the first ID in the query \

## update()

on update draws 3 lines for each "cast" or updates them \

## event function 

manages the states of the cast toggles \
and displays or hides lines \


# jsquery.js

simple script to call the php script containing query \
inputs come from the current value of the "from" and "to" buttons \
outputs is the query's response \

# map.js

responsible for map generation and updates \

## mapfnc()

similiar to create() in chartmultilegend.js \
forms long data out of tidy data \
draws lines  between points in chronological order on the map \

## setmapview()

selects a "cast" \
 focuses map on the first coordinate \
 adds the markers to start and end position \

## removemapview() 

simple remove markeres upon selecting to show all again \

## showpoint() 

unfinished feature to show a point inside the map after clicking inside the charts \
!problem was getting the time of the clicked position \

# salinity.js
 contains translated salinity formula from https://teos-10.github.io/GSW-Python/index.html \

## gsw_sp_from_p()

input : temperature C', conductivity mS/cm, pressure mbar \
ouput : salinity Unitless?\

# ui.js

contains some ui related functions \

## darkmode()

switch between 100 % und 05 color invert \

## scrollFunction()

drags the topmenu with it on scrolling \

## eventFunction line 41

on click in the list marks the clicked element blue and removes the mark from other \

## eventFuntion line 60 

switch between map and list of sorted out values/ parameters

## eventFuntion line 85 

list of contents for manuel page \
marks the currently shown subtopic \

## eventFuntion line 109 

rotates the site to address problems on horizontal orientated displays \

## ## eventFuntion line 140

unimplemented test function to remove a specific svg/graph \ 


