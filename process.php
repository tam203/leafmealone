<?php
// requires php5
define('UPLOAD_DIR', 'images/');
$img = $_POST['img'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$data = base64_decode($img);
$file = UPLOAD_DIR . uniqid() . '.png';
$success = file_put_contents($file, $data);
header('Content-type: application/json');
print $success ? '{"url":"'.$file.'"}' : '{}' ;
?>