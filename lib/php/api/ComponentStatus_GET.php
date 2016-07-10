<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ComponentStatus_GET
 *
 * @author zmiller
 */
class ComponentStatus_GET extends Service{
    
    protected function authorize() {
        return true;
    }

    protected function execute() {
        
        $oSerialTable = new SerialTable($this->m_oConnection);
        $aComponents = array();
        
        $aSupportedComponents = [
            ArduinoConstants::PERI_PUMP_ID,
            ArduinoConstants::SOLENOID_ID,
            ArduinoConstants::LIGHT_ID,
            ArduinoConstants::FAN_ID
        ];
        
        foreach($aSupportedComponents as $iComponent) {
            $aStatus = $oSerialTable->getComponentStatus($iComponent);
            if($aStatus !== false && !empty($aStatus[0])){
                array_push($aComponents, $aStatus[0]);
            } elseif(empty($aStatus[0])) {
                $aStatus = $oSerialTable->getEmptySerial($iComponent);
                array_push($aComponents, $aStatus[0]);
            }
        }
        
        $this->setData($aComponents);
        return true;
    }

    protected function validate() {
        return true;
    }

//put your code here
}
