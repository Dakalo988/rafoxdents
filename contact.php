<?php
// Set the content type to application/json for AJAX responses
header('Content-Type: application/json');

// IMPORTANT: CONFIGURE THIS
$recipient_email = 'your_email@example.com'; // <<<===== CHANGE THIS TO YOUR EMAIL ADDRESS

// --- Do not edit below this line unless you know what you're doing ---

// Initialize response array
$response = array(
    'status' => 'error',
    'message' => 'An unexpected error occurred.'
);

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Invalid request method.';
    echo json_encode($response);
    exit;
}

// Get and sanitize form data
$name = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim(strip_tags($_POST['phone'])) : '';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

// Basic validation
if (empty($name) || empty($email) || empty($message) || empty($phone)) {
    $response['message'] = 'Please fill in all required fields.';
    echo json_encode($response);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response['message'] = 'Please provide a valid email address.';
    echo json_encode($response);
    exit;
}

// Prepare email
$subject = "New Contact Form Submission from Rafox Dents Website";
$email_body = "You have received a new message from your website contact form.\n\n";
$email_body .= "Here are the details:\n\n";
$email_body .= "Name: $name\n";
$email_body .= "Email: $email\n";
$email_body .= "Phone: $phone\n\n";
$email_body .= "Message:\n$message\n";

// Set email headers
// This is important for the 'Reply-To' feature to work correctly in your email client
$headers = "From: $name <$email>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send the email
if (mail($recipient_email, $subject, $email_body, $headers)) {
    $response['status'] = 'success';
    $response['message'] = 'Thank you! Your message has been sent successfully.';
} else {
    // If mail() fails, it's often a server configuration issue
    $response['message'] = 'Sorry, there was an error sending your message. Please try again later.';
}

// Send the JSON response back to the JavaScript
echo json_encode($response);
?>