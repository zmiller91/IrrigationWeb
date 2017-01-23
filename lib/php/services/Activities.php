<?php

/**
 * @author zmiller
 */
class Activities extends Service{
    
    private $_supportedActivities;
    private $_irrigationComponents;
    
    public function __construct($strMethod, $aInput) {
        parent::__construct($strMethod, $aInput);
        
        $this->_supportedActivities = array(
            ArduinoConstants::IRRIGATE_ID, 
            ArduinoConstants::ILLUMINATE_ID, 
            ArduinoConstants::HVAC_ID
        );
        
        $this->_irrigationComponents = array(
            ArduinoConstants::WATER_PUMP_ID,
            ArduinoConstants::PP1_ID,
            ArduinoConstants::PP2_ID,
            ArduinoConstants::PP3_ID,
            ArduinoConstants::PP4_ID
        );
    }
    
    protected function allowableMethods() {
        return array(self::GET, self::PUT);
    }

    protected function authorize() {
        return true;
    }

    protected function validate() {
        return true;
    }

    protected function get(){
        
        $this->m_mData = $this->fetch();
        return true;
    }
    
    protected function put() {
        
        $changes = array();
        $existingConfiguration = $this->fetch();
        
        $OverridesTable = new OverridesTable($this->m_oConnection);
        $ConfigurationTable = new ConfigurationTable($this->m_oConnection);
        
        foreach ($this->m_aInput as $id => $new) {
            $existing = $existingConfiguration[$id];
            
            // Look for override changes
            if ($new["state"] != $existing["state"]) {
                
                $process = ArduinoConstants::OVERRIDE_ON_OFF;
                $state = strtolower($new["state"]) === "on" ? "1" : "0";
                $new["state"] = $state;
                $OverridesTable->put($new);
                
                RMQConnection::send($new["id"], $process, $new["state"]);
            }
            
            // Look for configuration changes
            foreach ($new["configuration"] as $process => $nConf) {
                $eConf = $existing["configuration"][$process];
                if(!$this->equals($nConf, $eConf)) {
                    $value = $nConf["value"] * $nConf["scale"];
                    $ConfigurationTable->put($nConf);
                    RMQConnection::send($nConf["component"], $process, $value);
                }
            }
            
            // Look for component changes
            if(isset($new["components"])) {
                foreach($new["components"] as $component => $nConf) {
                    $eConf = $existing["components"][$component];
                    if(!$this->equals($nConf, $eConf)) {
                        $value = $nConf["value"] * $nConf["scale"];
                        $ConfigurationTable->put($nConf);
                        RMQConnection::send($component, $nConf["process"], $value);
                    }
                }
            }
        }
        
        return true;
    }
    
    private function equals($a, $b) {
        $aJson = json_encode($a);
        $bJson = json_encode($b);
        return $aJson === $bJson;
    }
            
    
    private function getEmpty($component, $process, $value, $scale){
        return array(
            "component" => $component,
            "process" => $process,
            "value" => $value,
            "scale" => $scale
        );
    }
    
    private function fetch(){
        
        $OverridesTable = new OverridesTable($this->m_oConnection);
        $ConfigurationTable = new ConfigurationTable($this->m_oConnection);
        $ArduinoTable = new ArduinoTable($this->m_oConnection);
        $activities = $ArduinoTable->getConstants($this->_supportedActivities);
        $overrides = $OverridesTable->select("1", $this->_supportedActivities);
        $configuration = $ConfigurationTable->select("1", $this->_supportedActivities);
        $ICConfiguration = $ConfigurationTable->select("1", $this->_irrigationComponents);
        
        // Apply State
        foreach($activities as $id => &$activity) {
            $state = "off";
            if(key_exists($id, $overrides)) {
                $state = $overrides[$id][$state];
            }
            
            $activity["state"] = $state;
        }
        
        // Create the base objects
        $retval = array(
            "light" => $activities[ArduinoConstants::ILLUMINATE_ID],
            "irrigation" => $activities[ArduinoConstants::IRRIGATE_ID],
            "hvac" => $activities[ArduinoConstants::HVAC_ID],
            
        );
        
        // Create the lighting configuration
        $timeOnId = ArduinoConstants::CONF_TIME_ON;
        $timeOffId = ArduinoConstants::CONF_TIME_OFF;
        $illuminateId = ArduinoConstants::ILLUMINATE_ID;
        $retval["light"]["configuration"] = array(
            
            $timeOnId => isset($configuration[$illuminateId . "-" . $timeOnId]) ?
                $configuration[$illuminateId . "-" . $timeOnId] : 
                $this->getEmpty($illuminateId, $timeOnId, "0", 60000),
            
            $timeOffId => isset($configuration[$illuminateId . "-" . $timeOffId]) ?
                $configuration[$illuminateId . "-" . $timeOffId] : 
                $this->getEmpty($illuminateId, $timeOffId, "0", 60000),
        );
        
        // Create the hvac configuration
        $maxId = ArduinoConstants::CONF_MAX;
        $minId = ArduinoConstants::CONF_MIN;
        $hvacId = ArduinoConstants::HVAC_ID;
        $retval["hvac"]["configuration"] = array(
            
            $maxId => isset($configuration[$hvacId . "-" . $maxId]) ?
                $configuration[$hvacId . "-" . $maxId] : 
                $this->getEmpty($hvacId, $maxId, "0", 5),
            
            $minId => isset($configuration[$hvacId . "-" . $minId]) ?
                $configuration[$hvacId . "-" . $minId] : 
                $this->getEmpty($hvacId, $minId, "0", 5),
        );
        
        // Create the irrigagation configuration
        $irrigationId = ArduinoConstants::IRRIGATE_ID;
        $retval["irrigation"]["configuration"] = array(
            $minId => isset($configuration[$irrigationId . "-" . $minId]) ?
                $configuration[$irrigationId . "-" . $minId] : 
                $this->getEmpty($irrigationId, $minId, "100", 1024/100),
        );
        
        // Create the irrigation's component configuration
        $pp1 = ArduinoConstants::PP1_ID;
        $pp2 = ArduinoConstants::PP2_ID;
        $pp3 = ArduinoConstants::PP3_ID;
        $pp4 = ArduinoConstants::PP4_ID;
        $water = ArduinoConstants::WATER_PUMP_ID;
        $resevior = ArduinoConstants::RESEVIOR_PUMP_ID;
        $onTime = ArduinoConstants::CONF_TIME_ON;
        $retval["irrigation"]["components"] = array (
            
            $resevior => isset($ICConfiguration[$resevior]) ? 
                $ICConfiguration[$resevior] : 
                $this->getEmpty($resevior, $onTime, "0", 602),
            
            $water => isset($ICConfiguration[$water]) ? 
                $ICConfiguration[$water] : 
                $this->getEmpty($water, $onTime, "0", 602),
            
            $pp1 => isset($ICConfiguration[$pp1]) ? 
                $ICConfiguration[$pp1] : 
                $this->getEmpty($pp1, $onTime, "0", 602),
            
            $pp2 => isset($ICConfiguration[$pp2]) ? 
                $ICConfiguration[$pp2] : 
                $this->getEmpty($pp2, $onTime, "0", 602),
            
            $pp3 => isset($ICConfiguration[$pp3]) ? 
                $ICConfiguration[$pp3] : 
                $this->getEmpty($pp3, $onTime, "0", 602),
            
            $pp4 => isset($ICConfiguration[$pp4]) ? 
                $ICConfiguration[$pp4] : 
                $this->getEmpty($pp4, $onTime, "0", 602),
        );
        
        return $retval;
    }
}
