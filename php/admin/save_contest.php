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
    if (empty($input['contest_name']) || empty($input['rank'])) {
        sendResponse(false, null, 'Contest name and rank are required');
    }
    
    // Sanitize inputs
    $contest_name = sanitizeInput($input['contest_name']);
    $rank = sanitizeInput($input['rank']);
    $team_name = isset($input['team_name']) ? sanitizeInput($input['team_name']) : null;
    $standing_link = isset($input['standing_link']) ? sanitizeInput($input['standing_link']) : null;
    $id = isset($input['id']) ? (int)$input['id'] : null;
    
    $conn = getConnection();
    
    if ($id) {
        // Update existing contest
        $stmt = $conn->prepare("UPDATE contests SET contest_name=?, rank=?, team_name=?, standing_link=?, updated_at=CURRENT_TIMESTAMP WHERE id=?");
        $stmt->bind_param("ssssi", $contest_name, $rank, $team_name, $standing_link, $id);
        $message = 'Contest updated successfully';
    } else {
        // Insert new contest
        $stmt = $conn->prepare("INSERT INTO contests (contest_name, rank, team_name, standing_link) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $contest_name, $rank, $team_name, $standing_link);
        $message = 'Contest added successfully';
    }
    
    if ($stmt->execute()) {
        $contest_id = $id ?: $conn->insert_id;
        sendResponse(true, ['id' => $contest_id, 'message' => $message]);
    } else {
        sendResponse(false, null, 'Failed to save contest');
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    sendResponse(false, null, 'Error saving contest: ' . $e->getMessage());
}
?>
