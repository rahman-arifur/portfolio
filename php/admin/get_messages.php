<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config.php';

try {
    $conn = getConnection();
    
    // Fetch all messages with full details
    $sql = "SELECT * FROM messages ORDER BY created_at DESC";
    $result = $conn->query($sql);
    
    $messages = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $messages[] = $row;
        }
    }
    
    $conn->close();
    
    sendResponse(true, $messages);
    
} catch (Exception $e) {
    sendResponse(false, null, 'Error fetching messages: ' . $e->getMessage());
}
?>
