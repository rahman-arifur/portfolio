<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, null, 'Only POST method allowed');
}

try {
    // Get POST data
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required field
    if (empty($input['id'])) {
        sendResponse(false, null, 'Project ID is required');
    }
    
    $id = (int)$input['id'];
    
    $conn = getConnection();
    
    // Delete project
    $stmt = $conn->prepare("DELETE FROM projects WHERE id=?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            sendResponse(true, ['message' => 'Project deleted successfully']);
        } else {
            sendResponse(false, null, 'Project not found');
        }
    } else {
        sendResponse(false, null, 'Failed to delete project');
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    sendResponse(false, null, 'Error deleting project: ' . $e->getMessage());
}
?>
