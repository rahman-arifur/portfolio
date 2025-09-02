<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config.php';

try {
    $conn = getConnection();
    
    // Fetch all projects with full details
    $sql = "SELECT * FROM projects ORDER BY created_at DESC";
    $result = $conn->query($sql);
    
    $projects = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            // Parse JSON technologies field
            $row['technologies'] = json_decode($row['technologies'], true) ?? [];
            $projects[] = $row;
        }
    }
    
    $conn->close();
    
    sendResponse(true, $projects);
    
} catch (Exception $e) {
    sendResponse(false, null, 'Error fetching projects: ' . $e->getMessage());
}
?>
