<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, null, 'Only POST method allowed');
}

try {
    // Get POST data
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (empty($input['name']) || empty($input['email']) || empty($input['subject']) || empty($input['message'])) {
        sendResponse(false, null, 'All fields are required');
    }
    
    // Sanitize inputs
    $name = sanitizeInput($input['name']);
    $email = sanitizeInput($input['email']);
    $subject = sanitizeInput($input['subject']);
    $message = sanitizeInput($input['message']);
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, null, 'Invalid email format');
    }
    
    $conn = getConnection();
    
    // Prepare and execute insert statement
    $stmt = $conn->prepare("INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $name, $email, $subject, $message);
    
    if ($stmt->execute()) {
        // Optional: Send email notification
        $to = "arifurr946@gmail.com"; // Your email address
        $email_subject = "Portfolio Contact: " . $subject;
        $email_body = "Name: $name\nEmail: $email\nSubject: $subject\n\nMessage:\n$message";
        $headers = "From: $email\r\nReply-To: $email\r\n";
        
        // Uncomment the line below if you want to send emails
        // mail($to, $email_subject, $email_body, $headers);
        
        sendResponse(true, ['message' => 'Message sent successfully']);
    } else {
        sendResponse(false, null, 'Failed to save message');
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    sendResponse(false, null, 'Error sending message: ' . $e->getMessage());
}
?>
