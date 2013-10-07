<?php
/**
* This section ensures that Twilio gets a response.
*/
header('Content-type: text/xml');
echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<Response><Sms>Thanks for your comment tip! - Team Sweetness </Sms></Response>'; //Place the desired response (if any) here
/**
* This section actually sends the email.
*/
$to = "twilio@sweetnesslabs.com"; // Your email address
/*$subject = "Message from {$_REQUEST['From']} at {$_REQUEST['To']}";*/
$subject = "Message from {$_REQUEST['From']}";
$message = "You have received a message from {$_REQUEST['From']}.
Body: {$_REQUEST['Body']}";
$headers = "From: twilio@sweetnesslabs.com"; // Who should it come from?

mail($to, $subject, $message, $headers);
