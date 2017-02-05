<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ComponentState
 *
 * @author zmiller
 */
class States extends Service{

    protected function allowableMethods() {
        return array(self::POST, self::GET);
    }

    protected function authorize() {
        return true;
    }

    protected function validate() {
        return true;
    }
    
    protected function post() {
        $status = $this->m_aInput;
        $StatesTable = new StatesTable($this->m_oConnection);
        $StatesTable->insert("1", $status["component"], $status["state"]);
        return true;
    }
    
    protected function get() {
        $retval = array();
        $componentList = $this->m_aInput["components"];
        $StatesTable = new StatesTable($this->m_oConnection);
        foreach($componentList as $component) {
            $retval[$component] = $StatesTable->select($this->m_aInput["grow"], $component);
        }
        
        $this->m_mData = $retval;
        return true;
    }

}
