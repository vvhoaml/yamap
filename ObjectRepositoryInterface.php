<?php
interface ObjectRepositoryInterface {
	public function processAction();
	public function getAllObjects();
	public function addObject($name, $status, $latitude, $longitude);
	public function updateObjectStatus($id, $newStatus);
	public function returnErrorJSON($errorMessage);
}