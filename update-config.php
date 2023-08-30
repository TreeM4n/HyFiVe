<?php
// Assuming your JSON file path
$jsonFilePath = 'settings.json';

// Read the POST data
$jsonString = file_get_contents('php://input');
$jsonData = json_decode($jsonString);

if ($jsonData === null) {
    http_response_code(400);
    echo 'Invalid JSON data';
} else {
    // Write the updated JSON data to the file
    if (file_put_contents($jsonFilePath, json_encode($jsonData, JSON_PRETTY_PRINT)) !== false) {
        echo 'JSON file updated successfully';
    } else {
        http_response_code(500);
        echo 'Error writing JSON file';
    }
}
?>
