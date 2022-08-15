<?php
/**
 * Shows how to use forward compatibility APIs from InfluxDB 1.8.
 * tuned to hyfive prototype
 */

require __DIR__ . './vendor/autoload.php';

use InfluxDB2\Client;
use InfluxDB2\Point;

if(isset($_POST['start']))
{
    $start = $_POST['start'];

    // Do whatever you want with the $uid
}

//echo $start;

if(isset($_POST['end']))
{
    $end = $_POST['end'];

    // Do whatever you want with the $uid
}
/*
$username = 'hyfive';
$password = 'hyfive';

$database = 'localhyfive';
$retentionPolicy = 'autogen';

$bucket = "$database/$retentionPolicy";

$client = new Client([
    "url" => "localhost:8086",
    "token" => "$username:$password",
    "bucket" => $bucket,
    "org" => "-",
    "precision" => InfluxDB2\Model\WritePrecision::S
]);
*/

$username = 'admin';
$password = 'hyfive0815';

$database = 'hyfive';
$retentionPolicy = 'autogen';

$bucket = "$database/$retentionPolicy";

$client = new Client([
    "url" => "10.11.180.23:8086",
    "token" => "$username:$password",
    "bucket" => $bucket,
    "org" => "-",
    "precision" => InfluxDB2\Model\WritePrecision::S
]);

/*
SELECT time, TSYTemperatrue, MS5837Temperature,
MS5837Press, Conducitvity FROM cabin
WHERE time >= '2022-04-07T07:38:00Z' 
and time < '2022-04-07T09:38:00Z'

*/




$queryApi = $client->createQueryApi();
$query = "from(bucket: \"{$bucket}\") 
             |> range(start: $start, stop: $end) 
             
             

";
$tables = $queryApi->query($query);
/*
foreach ($tables as $table) {
    foreach ($table->records as $record) {
        $time = $record->getTime();
        $measurement = $record->getMeasurement();
        $value = $record->getValue();
        print "$time $measurement is $value\n";
    }
}
*/
$array = [];

foreach ($tables as $table) {
    foreach ($table->records as $record) {
        $time = $record->getTime();
        $measurement = $record->getMeasurement();
        $value = $record->getValue();
        $field = $record->getField();
        $innerarray = (object) ['time' => $time, 'prop' => $field, 'value' => $value];
        array_push($array,$innerarray);
       
        //print "$innerarray\n";
       
    }
}


$tables = [];
//header('Content-type:application/json;charset=utf-8');
echo json_encode( $array, JSON_PRETTY_PRINT ) ;
   
$client->close();

?>