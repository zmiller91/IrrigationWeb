<?php
/**
 * @author zmiller
 */
class Poll extends Service{
    
    protected function allowableMethods() {
        return array(self::POST);
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
}
