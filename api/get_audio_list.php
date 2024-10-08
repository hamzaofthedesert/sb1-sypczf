<?php
header('Content-Type: application/json');

$audioFolder = '../audio'; // Adjust this path to your audio folder
$audioFiles = glob($audioFolder . '/*.{mp3,wav,ogg}', GLOB_BRACE);

$audioList = [];
foreach ($audioFiles as $index => $file) {
    $audioList[] = [
        'id' => $index + 1,
        'name' => basename($file),
        'path' => str_replace('../', '', $file)
    ];
}

echo json_encode($audioList);