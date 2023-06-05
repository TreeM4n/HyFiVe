/** InfluxDB v2 URL */
const url = 'http://hyfive.info:8086'
/** InfluxDB authorization token */
const token =  'pD7hE8gVEAkEU2ewamqMCTNzoBOFuv3Qmyu6-awH5uaHhHc8ArgRgIkWGzFf_k0KYyVQ3XFIX7eed2uq27AdjQ=='
/** Organization within InfluxDB  */
const org =  'HyFive'
/**InfluxDB bucket used in examples  */
const bucket = 'hyfive'
// ONLY onboarding example
/**InfluxDB user  */
const username = 'hyfive'
/**InfluxDB password  */
const password = 'hyfive'

export {url, token, org, bucket, username, password}

/*

$username = 'hyfive';
$password = 'hyfive';

$database = 'localhyfive';
$retentionPolicy = 'autogen';
//§url = 'localhost:8086';
//$bucket = "$database/$retentionPolicy";
$bucket = 'hyfive';

$client = new Client([
    "url" => "hyfive.info:8086",
    //"token" => "$username:$password",
    "token" => "pD7hE8gVEAkEU2ewamqMCTNzoBOFuv3Qmyu6-awH5uaHhHc8ArgRgIkWGzFf_k0KYyVQ3XFIX7eed2uq27AdjQ==",
   // "bucket" => $bucket,
    "org" => "HyFive",
    //"org" => "-",
    "precision" => InfluxDB2\Model\WritePrecision::S
]);

*/