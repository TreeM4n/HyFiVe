
let url, token, org, bucket, username, password


// Function to fetch and set the values from the JSON file
async function fetchSettings() {
  try {
    const response = await fetch('settings.json');
    const data = await response.json();
    url = data.url;
    token = data.token;
    org = data.org;
    bucket = data.bucket;
    username = data.username;
    password = data.password;
  } catch (error) {
    console.error('Error:', error);
  }
}


export { url, token, org, bucket, username, password, fetchSettings };

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