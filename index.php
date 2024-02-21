<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config.php';
require_once 'DatabaseConnection.php';
require_once 'ObjectRepository.php';

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $db = new DatabaseConnection($GLOBALS['host'], $GLOBALS['username'], $GLOBALS['password'], $GLOBALS['dbname']);
	$objectRepository = new ObjectRepository($db);
	$objectRepository->processAction();
}
?>

<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Map</title>
	<style>
		* {
			margin: 0;
		}
	</style>
	<script src="https://api-maps.yandex.ru/v3/?apikey=d6057eb8-931f-4777-a448-09ec181cc465&lang=ru_RU"></script>
	<script src="main.js?newversion"></script>
</head>
<body>
	<div id="map" style="width: 100vw; height: 100vh"></div>
</body>
</html>