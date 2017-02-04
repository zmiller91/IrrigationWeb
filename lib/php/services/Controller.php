<?php

/**
 * @author zmiller
 */
class Controller extends Service {
    
    protected function allowableMethods() {
        return array(self::PUT, self::GET);
    }

    protected function authorize() {
        return true;
    }

    protected function validate() {
        return true;
    }
    
    protected function put() {
        $serialNumber = $this->m_aInput["controller"];
        $ControllersTable = new ControllerTable($this->m_oConnection);
        $ControllersTable->insert("1", $serialNumber);
        return true;
    }
    
    protected function get() {
        $ControllersTable = new ControllerTable($this->m_oConnection);
        $this->m_mData = $ControllersTable->select("1");
        return true;
    }
}
