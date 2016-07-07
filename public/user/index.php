<?php

require_once '../../app/ApplicationAutoloader.php';

$POST = json_decode(file_get_contents('php://input'),true);
if(!empty($POST) && $POST['method'] == 'register'){
    
    $oConn = Connection::getConnection(DB_USER, DB_PASSWD);
    $oUser = new User($oConn);
    $bSuccess = $oUser->register($POST['user']['name'], $POST['user']['pass']);
    Connection::commit($oConn);
    echo json_encode($oUser->getUser());
}

if(!empty($POST) && $POST['method'] == 'login'){
    
    $oConn = Connection::getConnection(DB_USER, DB_PASSWD);
    $oUser = new User($oConn);
    $bSuccess = $oUser->login($POST['user']['name'], $POST['user']['pass']);
    Connection::commit($oConn);
    echo json_encode($oUser->getUser());
}

if(!empty($POST) && $POST['method'] == 'logout'){
    
    $oConn = Connection::getConnection(DB_USER, DB_PASSWD);
    $oUser = new User($oConn);
    $bSuccess = $oUser->logout();
    Connection::commit($oConn);
    echo json_encode($oUser->getUser());
}

if(!empty($_GET) && $_GET['method'] == 'authorize'){
    
    $oConn = Connection::getConnection(DB_USER, DB_PASSWD);
    $oUser = new User($oConn);
    $oUser->authenticate(true);
    echo json_encode($oUser->getUser());
}