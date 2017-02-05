<?php
/**
 * @author zmiller
 */
class Poll extends Service{
    
    protected function allowableMethods() {
        return array(self::GET, self::POST);
    }

    protected function authorize() {
        return true;
    }

    protected function validate() {
        return true;
    }
    
    protected function post() {
        
        $reading = $this->m_aInput;
        $PollTable = new PollTable($this->m_oConnection);
        $PollTable->insert("1", $reading["component"], $reading["value"]);
        return true;
    }
    
    protected function get() {
  
        $grow = $this->m_aInput["grow"];
        $PollTable = new PollTable($this->m_oConnection);
        $this->m_mData = array(
            "moisture" => $PollTable->getPoll($grow, ArduinoConstants::MOISTURE_SENSOR_ID),
            "photoresistor" => $PollTable->getPoll($grow, ArduinoConstants::PHOTORESISTOR_ID),
            "temp" => $PollTable->getPoll($grow, ArduinoConstants::TEMP_SENSOR_ID),
            "humidity" => $PollTable->getPoll($grow, ArduinoConstants::HUMIDITY_SENSOR_ID)
        );
        
        return true;
    }
}
