<?PHP

$file = "";
if (htmlspecialchars($_GET["title"])) {
    $file = htmlspecialchars($_GET["title"]);

}else{
    $file = "";
}


 $data = json_decode(file_get_contents($file), true);

header('Content-Type: application/json');
echo json_encode($data);

?>
