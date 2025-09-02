<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, PUT');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, null, 'Only POST method allowed');
}

try {
    // Get POST data
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (empty($input['name']) || empty($input['description'])) {
        sendResponse(false, null, 'Name and description are required');
    }
    
    // Sanitize inputs
    $name = sanitizeInput($input['name']);
    $description = sanitizeInput($input['description']);
    $technologies = isset($input['technologies']) ? json_encode($input['technologies']) : json_encode([]);
    $github_link = isset($input['github_link']) ? sanitizeInput($input['github_link']) : null;
    $demo_link = isset($input['demo_link']) ? sanitizeInput($input['demo_link']) : null;
    $id = isset($input['id']) ? (int)$input['id'] : null;
    
    $conn = getConnection();
    
    if ($id) {
        // Update existing project
        $stmt = $conn->prepare("UPDATE projects SET name=?, description=?, technologies=?, github_link=?, demo_link=?, updated_at=CURRENT_TIMESTAMP WHERE id=?");
        $stmt->bind_param("sssssi", $name, $description, $technologies, $github_link, $demo_link, $id);
        $message = 'Project updated successfully';
    } else {
        // Insert new project
        $stmt = $conn->prepare("INSERT INTO projects (name, description, technologies, github_link, demo_link) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $name, $description, $technologies, $github_link, $demo_link);
        $message = 'Project added successfully';
    }
    
    if ($stmt->execute()) {
        $project_id = $id ?: $conn->insert_id;
        sendResponse(true, ['id' => $project_id, 'message' => $message]);
    } else {
        sendResponse(false, null, 'Failed to save project');
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    sendResponse(false, null, 'Error saving project: ' . $e->getMessage());
}
?>
