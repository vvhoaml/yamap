<?php

header('Content-Type: application/json; charset=utf-8');

$postData = json_decode(file_get_contents('php://input'), true);

if (!isset($postData['id']) || !isset($postData['status'])) {
    echo json_encode(array('success' => false, 'error' => 'Недостаточно данных для обновления', 'received_data' => $postData));
    exit;
}

$id = $postData['id'];
$status = $postData['status'];
$jsonFile = 'objects.json';
$jsonData = json_decode(file_get_contents($jsonFile), true);

if (empty($jsonData) || !isset($jsonData['features'])) {
    echo json_encode(array('success' => false, 'error' => 'Ошибка чтения данных из JSON файла'));
    exit;
}

foreach ($jsonData['features'] as &$feature) {
    if ($feature['id'] == $id) {
        $feature['properties']['status'] = $status;
        break;
    }
}

if (file_put_contents($jsonFile, json_encode($jsonData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) !== false) {
    echo json_encode(array('success' => true));
} else {
    echo json_encode(array('success' => false, 'error' => 'Ошибка записи в файл'));
}
?>