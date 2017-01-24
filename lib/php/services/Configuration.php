<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Configuration
 *
 * @author zmiller
 */
class Configuration extends Service{

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
        
        $ConfigurationTable = new ConfigurationTable($this->m_oConnection);
        foreach($this->m_aInput as $conf) {
            $ConfigurationTable->put($conf);
                $value = $conf["value"] * $conf["scale"];
                $ConfigurationTable->put($conf);
                RMQConnection::send($conf["component"], $conf["process"], $value);
        }
        
        return true;
    }

    protected function get() {
        $retval = array();
        $ConfigurationTable = new ConfigurationTable($this->m_oConnection);
        $components = $this->m_aInput["components"];
        $configuration = $ConfigurationTable->select("1", $components);
        
        // Load the component configuration
        foreach($configuration as $k => $c) {
            $parts = split("-", $k);
            if(sizeof($parts) == 2) {
                $component = $parts[0];
                $process = $parts[1];
                if(!array_key_exists($component, $retval)){
                    $retval[$component] = array();
                }
                
                $retval[$component][$process] = $c;
            }
        }
        
        // Stub out any without 
        foreach($components as $c) {
            if(!array_key_exists($c, $retval)) {
                $retval[$c] = array();
            }
        }
        
        $this->m_mData = $retval;
        return true;
    }
}
