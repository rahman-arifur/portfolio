<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config.php';

try {
    $conn = getConnection();
    
    // Fetch all contests with full details
    $sql = "SELECT * FROM contests ORDER BY created_at DESC";
    $result = $conn->query($sql);
    
    $contests = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $contests[] = $row;
        }
    }
    
    $conn->close();
    
    sendResponse(true, $contests);
    
} catch (Exception $e) {
    sendResponse(false, null, 'Error fetching contests: ' . $e->getMessage());
}
?>
