<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config.php';

if (!isset($_GET['id']) || empty($_GET['id'])) {
    sendResponse(false, null, 'Message ID is required');
}

try {
    $id = (int)$_GET['id'];
    $conn = getConnection();
    
    // Fetch specific message
    $stmt = $conn->prepare("SELECT * FROM messages WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $message = $result->fetch_assoc();
        sendResponse(true, $message);
    } else {
        sendResponse(false, null, 'Message not found');
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    sendResponse(false, null, 'Error fetching message: ' . $e->getMessage());
}
?>
