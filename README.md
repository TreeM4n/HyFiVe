# Configuration and Modification of Hyfive WebApp

## Configuration options

### Query 

#### ./js/config.js
1. Changing the initial load of the query \
On page load the Website will load from now to 2 days ago \
This setting can be changed in line 3 "export var  initialhours"\

2. Changing Parameter or metadata deletion out of the query \
By their name it can be added or removed in line 5 "export var mainblacklist" \
Configurations here are only intended for data which is never needed 

#### ./php/queryhyfive.php
Changes in InfluxDb Login can lead to denied accesses \
Changing Client API this can be circumvented \
$username = 'admin'; \
$password = 'hyfive0815'; \

$database = 'hyfive'; \
$retentionPolicy = 'autogen';\

$bucket = "$database/$retentionPolicy";\

$client = new Client([\
    "url" => "10.11.180.23:8086",\
    "token" => "$username:$password",\
    "bucket" => $bucket,\
    "org" => "-",\
    "precision" => InfluxDB2\Model\WritePrecision::S\
]);

### Visualization

#### ./js/config.js

each chart generator has a BLACKLIST to sort out unwanted parameters \
Horizontal charts : line 9 "export var chartblacklist"\
Vertical charts : line 44 "export var dcblacklist" \
Map : line 33 export var mapblacklistmap \

##### charts can be furthermore customized by:
1. adding a unit behind the label : 
line 26 export var thresholdUnits \
do not forget to edit the other threshold vars
2. setting min and max values which will get sorted out 
line 24 export var thresholdValues \
the values in the array correspind to them slot of var thresholdProp 
3. changing colors of line and label 
line 13-15 export const chartcolor \
similar to threshold the first parameter gets the first color \
but the first parameter here is the first charst which is drawn not which is first in \
line 22 

##### the map can be furthermore customized by: 
1.  changing the time before it seperates two paths 
line 37 export var MapDim 
2. changing the amount of path-coordinats which are displayed 
line 39 export var MapPoints \
the default is 2 which means 50 % are drawn aka. every second one \
2 is the minima and increasing the value also increases map performance and lowers accuracy 

#### ./js/map.js

##### toggle between online and offline map 
map.js has an inbuild switch for a higher resolution online map \
currently disabled to save mobile data on ships without stable connections \
this can be changed in line 35 \
commenting out: enable online/offline based on connection status \
online = false : enables only offline map \
online = true : enables only online map from naturalearthdata.com 



 

