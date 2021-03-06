<?php
/**
 * Shows how to use forward compatibility APIs from InfluxDB 1.8.
 */

require __DIR__ . '/vendor/autoload.php';

use InfluxDB2\Client;
use InfluxDB2\Point;

$username = 'admin';
$password = 'password';

$database = 'hyfive';
$retentionPolicy = 'autogen';

$bucket = "$database/$retentionPolicy";

$client = new Client([
    "url" => "192.168.178.36:8086",
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
$query = "from(bucket: \"{$bucket}\") |> range(start:-1h)";
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
header('Content-type:application/json;charset=utf-8');
echo json_encode( $tables, JSON_PRETTY_PRINT ) ;
   
$client->close();

?>