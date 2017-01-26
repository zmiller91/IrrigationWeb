<?php

/**
 * @author zmiller
 */
class Touch extends Service{

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
       foreach($this->m_aInput["components"] as $component) {
            RMQConnection::send($component, ArduinoConstants::OVERRIDE_TOUCH, 1);
       }
        
       return true;
    }
}
