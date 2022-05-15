<?php
// example query
/**
 * Shows how to query data into `string`
 */

require __DIR__ . '/../vendor/autoload.php';

use InfluxDB2\Client;
use InfluxDB2\Point;

$org = 'my-org';
$bucket = 'my-bucket';
$token = 'my-token';

//
// Creating client
//
$client = new Client([
    "url" => "http://localhost:8086",
    "token" => $token,
    "bucket" => $bucket,
    "org" => $org,
    "precision" => InfluxDB2\Model\WritePrecision::S
]);

//
// Write test data into InfluxDB
//
$writeApi = $client->createWriteApi();
$pointArray = [];

$dateNow = new DateTime('NOW');
for ($i = 1; $i <= 10; $i++) {
    $point = Point::measurement("weather")
        ->addTag("location", "Sydney")
        ->addField("temperature", rand(15, 30))
        ->time($dateNow->getTimestamp());
    $pointArray[] = $point;
    $dateNow->sub(new DateInterval('P1D'));
}

$writeApi->write($pointArray);
$writeApi->close();

//
// Get query client
//
$queryApi = $client->createQueryApi();

//
// Synchronously executes query and return result as unprocessed String
//
$result = $queryApi->queryRaw(
    "from(bucket: \"my-bucket\")
                |> range(start: 0)
                |> filter(fn: (r) => r[\"_measurement\"] == \"weather\"
                                 and r[\"_field\"] == \"temperature\"
                                 and r[\"location\"] == \"Sydney\")"
);
header('Content-type:application/json;charset=utf-8');
$jsonStr = json_encode( $result, JSON_PRETTY_PRINT ) ;

//Encode the data as a JSON string


printf("\n\n-------------------------- Query Raw ----------------------------\n\n");
printf($result);

$registration = $_POST['registration'];
$name= $_POST['name'];
$email= $_POST['email'];

if ($registration == "success"){
    // some action goes here under php
    echo json_encode(array("abc"=>'successfuly registered'));
}    


$client->close();