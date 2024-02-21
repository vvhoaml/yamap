<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'ObjectRepositoryInterface.php';
require_once 'DatabaseConnection.php';

class ObjectRepository implements ObjectRepositoryInterface {
	private $dbConnection;

    public function __construct(DatabaseConnection $dbConnection) {
        $this->dbConnection = $dbConnection;
    }

	public function processAction() {
        $action = isset($_GET['action']) ? $_GET['action'] : '';

        switch ($action) {
            case 'getAllObjects':
                $this->getAllObjects();
                break;
			default:
                $this->returnErrorJSON('Invalid action');
                break;
        }
    }

	public function returnErrorJSON($errorMessage) {
        header('Content-Type: application/json');
        echo json_encode(['error' => $errorMessage]);
        exit();
    }

	public function getAllObjects() {
		$conn = $this->dbConnection->getConnection();
		$statement = $conn->query('SELECT * FROM objects');
		return $statement->fetchAll(PDO::FETCH_ASSOC);

		header('Content-Type: application/json');
		echo json_encode($objects);
}

	public function addObject($name, $status, $latitude, $longitude) {
        $conn = $this->dbConnection->getConnection();
        $statement = $conn->prepare('INSERT INTO objects (name, status, latitude, longitude) VALUES (?, ?, ?, ?)');
        $statement->execute([$name, $status, $latitude, $longitude]);
        return $conn->lastInsertId();
    }

	public function updateObjectStatus($id, $newStatus) {
        $conn = $this->dbConnection->getConnection();
        $statement = $conn->prepare('UPDATE objects SET status = ? WHERE id = ?');
        return $statement->execute([$newStatus, $objectId]);
    }
}