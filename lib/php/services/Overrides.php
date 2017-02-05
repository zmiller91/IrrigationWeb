<?php

/**
 * @author zmiller
 */
class Overrides extends Service{

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
        $current = $OverridesTable->select($this->m_aInput["grow"]);
        unset($this->m_aInput["grow"]);
        foreach($this->m_aInput as $row) {
            $s = strtolower($row["state"]);
            $on = $s == "on";
            $off = $s == "off";
            $state = $on ? "1" : ($off ? "0" : "-1");
            $id = $row["id"];
            $action = ArduinoConstants::OVERRIDE_ON_OFF;
            RMQConnection::send($id, $action, $state);
            $OverridesTable->put($row);
        }
        
        return true;
    }

    protected function get() {
        
        $retval = array();
        
        // Get the components
        $ArduinoTable = new ArduinoTable($this->m_oConnection);
        $components = $ArduinoTable->getConstants($this->m_aInput["overrides"]);
        
        // Get any overrides
        $OverridesTable = new OverridesTable($this->m_oConnection);
        $overrides = $OverridesTable->select($this->m_aInput["grow"]);
        
        // Override the components states
        foreach($components as &$c) {
            $state = "auto";
            $key = $c["id"];
            if(array_key_exists($key, $overrides)) {
                $state = $overrides[$key]["value"];
            }
            
            $c["state"] = $state;
            $retval[$c["id"]] = $c;
        }
        
        $this->m_mData = $retval;
        return true;
    }
}
