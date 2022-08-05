<?php
 // path to your JSON file
$file = 'data3.json'; 
// put the content of the file in a variable
$data = file_get_contents($file); 
// JSON decode
$obj = json_decode($data);

echo json_encode( $obj, JSON_PRETTY_PRINT ) ;
   

?>