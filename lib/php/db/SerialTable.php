<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of SerialTable
 *
 * @author zmiller
 */
class SerialTable extends BaseTable{
    
    private $m_lookback = 2;
    
    public function __construct($conn) {
        parent::__construct($conn);
    }
    
    public function insertData($aData)
    {
        $date = $aData["date"];
        $aId = $aData["values"][0];
        $iProcess = $aData["values"][1];
        $iType = $aData["values"][2];
        $iValue = $aData["values"][3];
        
        $sql = 
<<<EOD
        INSERT INTO serial
        (arduino_id, process, type, value, date)
        VALUES
        ($aId, $iProcess, $iType, $iValue, "$date");
EOD;
        
        return $this->execute($sql);
    }
    
    public function getMoisturePoll()
    {
        $sql = 
<<<EOD
        SELECT value, date from serial
        LEFT JOIN arduino_constants 
        ON serial.process = arduino_constants.id
        WHERE arduino_constants.id = 3000
        AND serial.type = 2
        AND date > DATE_SUB(NOW(), INTERVAL $this->m_lookback DAY);
EOD;
        return $this->execute($sql);
    }
    
    public function getPhotoresistorPoll()
    {
        $sql = 
<<<EOD
        SELECT value, date from serial
        LEFT JOIN arduino_constants 
        ON serial.process = arduino_constants.id
        WHERE arduino_constants.id = 3001
        AND serial.type = 2
        AND date > DATE_SUB(NOW(), INTERVAL $this->m_lookback DAY);
EOD;
        return $this->execute($sql);
    }
    
    public function getTempPoll()
    {
        $sql = 
<<<EOD
        SELECT value, date from serial
        LEFT JOIN arduino_constants 
        ON serial.process = arduino_constants.id
        WHERE arduino_constants.id = 3002
        AND serial.type = 2
        AND date > DATE_SUB(NOW(), INTERVAL $this->m_lookback DAY);
EOD;
        return $this->execute($sql);
    }
    
    public function getOnOffNotifications($iNotification)
    {
        $sql = 
<<<EOD
        SELECT arduino_constants.name, value, date from serial
        LEFT JOIN arduino_constants 
        ON serial.process = arduino_constants.id
        WHERE arduino_constants.id = $iNotification
        AND serial.type = 1
        AND date > DATE_SUB(NOW(), INTERVAL $this->m_lookback DAY)
        ORDER BY date DESC, arduino_constants.id DESC, value ASC;
EOD;
        return $this->execute($sql);
    }
    
    public function getComponentStatus($iComponent)
    {
        $sql = 
<<<EOD
        SELECT arduino_constants.name, value, date from serial
        LEFT JOIN arduino_constants 
        ON serial.process = arduino_constants.id
        WHERE arduino_constants.id = $iComponent
        AND arduino_id=2
        AND date > DATE_SUB(NOW(), INTERVAL $this->m_lookback DAY)
        ORDER BY date DESC, value ASC
        LIMIT 1;
EOD;
        return $this->execute($sql);
    }
    
    public function getEmptySerial($iComponent) 
    {
        
        $sql = 
<<<EOD
        SELECT id, name, '2' AS arduino_id, id AS process, 
                '1' AS type, '0' AS value, null AS date 
        FROM arduino_constants 
        WHERE id = $iComponent;
EOD;
        return $this->execute($sql);
    }
}
