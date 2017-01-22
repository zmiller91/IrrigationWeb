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
class Components extends Service{

    protected function allowableMethods() {
        return array(self::GET, self::PUT);
    }
    
    protected function authorize() {
        return true;
    }

    protected function validate() {
        return true;
    }
    
    protected function put() {
        
        $OverridesTable = new OverridesTable($this->m_oConnection);
        $current = $OverridesTable->select("1");
        foreach($this->m_aInput as $row) {
            if(!(array_key_exists($row["id"], $current) && 
                strtolower($current[$row["id"]]["value"]) == strtolower($row["state"]))) {
                
                $s = strtolower($row["state"]);
                
                $on = $s == "on";
                $off = $s == "off";
                $state = $on ? "1" : ($off ? "0" : "-1");
                $id = $row["id"];
                $action = ArduinoConstants::OVERRIDE_ON_OFF;
                $args = implode(" ", array($id, $action, $state));
                $cmd = implode(" ", array(PYTHON, RMQSEND, $args));
                
                $command = escapeshellcmd($cmd);
                $output = shell_exec($command);
                $OverridesTable->put($row);
            }
        }
        
        return true;
    }

    protected function get() {
        
        $retval = array();
        
        // Get the components
        $ArduinoTable = new ArduinoTable($this->m_oConnection);
        $components = $ArduinoTable->getConstants(
            array(ArduinoConstants::LIGHT_ID, ArduinoConstants::FAN_ID, 
            ArduinoConstants::HEATER_ID, ArduinoConstants::RESEVIOR_PUMP_ID, 
            ArduinoConstants::WATER_PUMP_ID, ArduinoConstants::PP1_ID, 
            ArduinoConstants::PP2_ID, ArduinoConstants::PP3_ID, ArduinoConstants::PP4_ID,
                ArduinoConstants::MIXER_ID)
        );
        // Get any overrides
        $OverridesTable = new OverridesTable($this->m_oConnection);
        $overrides = $OverridesTable->select('1');
        
        // Override the components states
        foreach($components as &$c) {
            $state = "auto";
            $key = $c["id"];
            if(array_key_exists($key, $overrides)) {
                $state = $overrides[$key]["value"];
            }
            
            $c["state"] = $state;
            array_push($retval, $c);
        }
        
        $this->m_mData = $retval;
        return true;
    }
}
