<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Notifications_GET
 *
 * @author zmiller
 */
class Notifications_GET extends Service{
    public function __construct($oConnection, $aInput)
    {
        parent::__construct($oConnection, $aInput);
    }

    protected function authorize() {
        return true;
    }
    
    protected function validate() {
        return true;
    }
    
    protected function execute() {
        
        $oSerialTable = new SerialTable($this->m_oConnection);
        $aNotifications = array();
        
        $aSupportedNotifications = [
            ArduinoConstants::PUMP_ID,
            ArduinoConstants::PERI_PUMP_ID,
            ArduinoConstants::MIXER_ID,
            ArduinoConstants::PHDOWN_ID,
            ArduinoConstants::PHUP_ID,
            ArduinoConstants::SOLENOID_ID,
            ArduinoConstants::LIGHT_ID,
            ArduinoConstants::FAN_ID
        ];
        
        foreach($aSupportedNotifications as $iNotification) {
            $aNotifications[$iNotification] = 
                    $oSerialTable->getOnOffNotifications($iNotification);
        }
        
        $this->setData($aNotifications);
        return true;
    }
}
