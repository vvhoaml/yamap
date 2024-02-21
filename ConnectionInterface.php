<?php
interface ConnectionInterface {
    public function getConnection();
    public function closeConnection();
}