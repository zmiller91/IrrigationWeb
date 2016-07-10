<?php

require_once '../app/ApplicationAutoloader.php';

    //create a connection and authenticate a user
$oConnection = Connection::getConnection(DB_USER, DB_PASSWD);
$oUser = new User($oConnection);
$oUser->authenticate();

$strRequestMethod = $_SERVER["REQUEST_METHOD"];

if($strRequestMethod === "POST")
{
    $mPostData = json_decode(file_get_contents('php://input'), true);
    
            
    if(!empty($mPostData['method']) && $mPostData['method'] === "configuration")
    {
        $oArduinoConf = new ArduinoConf_POST($oConnection, $mPostData);
        $oArduinoConf->run();
    }
    
    // This default block is what a grow box calls to POST data
    else
    {
        $mPostData["values"] = explode(":", $mPostData["values"]);
        if(sizeof($mPostData["values"]) == 4)
        {
            $oSerialTable = new SerialTable($oConnection);
            if($oSerialTable->insertData($mPostData))
            {
                Connection::commit($oConnection);
                echo 204;
            }
            else 
            {
                Connection::rollback($oConnection);
                echo 500;
            }
        }
        else
        {
            echo 422;
        }
    }
}

else if($strRequestMethod === "GET" && isset($_GET["method"]))
{
    
    if($_GET["method"] === "configuration")
    {
        $oArduinoConf = new ArduinoConf_GET($oConnection, $_GET);
        $oArduinoConf->run();
    }
           
    if($_GET["method"] === "notifications")
    {
        $oNotifications = new Notifications_GET($oConnection, $_GET);
        $oNotifications->run();
    }
           
    if($_GET["method"] === "component_status")
    {
        $ComponentStatus = new ComponentStatus_GET($oConnection, $_GET);
        $ComponentStatus->run();
    }
    
    if($_GET["method"] === "sensor_data")
    {
        
    
        $oSerialTable = new SerialTable($oConnection);
        $aMoisturePoll = $oSerialTable->getMoisturePoll();
        $aPhotoPoll = $oSerialTable->getPhotoresistorPoll();
        $aTempPoll = $oSerialTable->getTempPoll();

        if($aMoisturePoll && $aPhotoPoll && $aTempPoll){

            echo json_encode(array(
                "moisture" => $aMoisturePoll,
                "photoresistor" => $aPhotoPoll,
                "temp" => $aTempPoll
            ));

//            echo file_get_contents("http://45.79.167.160//index.php?method=sensor_data");
        }
        else 
        {
            echo 500;
        }
    }
}
else
{
    readfile('html/main.html');
}

