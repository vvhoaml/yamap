<?php

$data = json_decode(file_get_contents('php://input'), true);
$file = 'objects.json';

$current_data = json_decode(file_get_contents($file), true);

    foreach ($current_data['features'] as &$feature) {
        if ($feature['id'] == $data['id']) {
            $feature['properties']['balloonContentHeader'] = $data['status'];
			$feature['properties']['clusterCaption'] = $data['status'];
			$feature['properties']['iconCaption'] = $data['status'];
			if ($data['status'] == 'Свободно') {
				$feature['options']['preset'] = 'islands#greenCircleDotIconWithCaption';
			} else {
				$feature['options']['preset'] = 'islands#redCircleDotIconWithCaption';
			}
            break;
        }
    }

    file_put_contents($file, json_encode($current_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    exit;
?>