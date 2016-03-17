<?php

require_once '../app/ApplicationAutoloader.php';

    
$strRequestMethod = $_SERVER["REQUEST_METHOD"];
if($strRequestMethod == "POST")
{
    $mPostData = json_decode(file_get_contents('php://input'), true);
    $mPostData["values"] = explode(":", $mPostData["values"]);
    if(sizeof($mPostData["values"]) == 4)
    {
        $conn = Connection::getConnection("ima_user", "fotbaltym9");
        $oSerialTable = new SerialTable($conn);
        if($oSerialTable->insertData($mPostData))
        {
            Connection::commit($conn);
            echo 204;
        }
        else 
        {
            Connection::rollback($conn);
            echo 500;
        }
    }
    else
    {
        echo 422;
    }
}

if($strRequestMethod === "GET" && isset($_GET["method"]) && $_GET["method"] == "sensor_data")
{
    
    $conn = Connection::getConnection("ima_user", "fotbaltym9");
    $oSerialTable = new SerialTable($conn);
    $aMoisturePoll = $oSerialTable->getMoisturePoll();
    $aPhotoPoll = $oSerialTable->getPhotoresistorPoll();
    $aTempPoll = $oSerialTable->getTempPoll();

    if($aMoisturePoll && $aPhotoPoll && $aTempPoll){
        echo json_encode(array(
            "moisture" => $aMoisturePoll,
            "photoresistor" => $aPhotoPoll,
            "temp" => $aTempPoll
        ));
    }
    else 
    {
        echo 500;
    }
}
else
{
    readfile('html/main.html');
}

