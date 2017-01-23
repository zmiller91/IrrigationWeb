<?php

/**
 * @author zmiller
 */
class RMQConnection {
    
    public static function send($component, $process, $value){
        $args = implode(" ", array($component, $process, intval($value)));
        $cmd = implode(" ", array(PYTHON, RMQSEND, $args));
        $command = escapeshellcmd($cmd);
        $output = shell_exec($command);
    }
}
