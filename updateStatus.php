<?php

$id = $_POST['id'];
$newState = $_POST['newState']; 

$currentData = json_decode(file_get_contents('objects.json'), true);

$currentData['features'][$id]['properties']['status'] = $newState;

$currentData = json_encode($currentData, JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_PRETTY_PRINT);

file_put_contents('objects.json', $currentData);

echo json_encode(array('success' => true));
?>