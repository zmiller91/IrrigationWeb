<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ArduinoConf_GET
 *
 * @author zmiller
 */
class ArduinoConf_GET extends Service{
    
    protected $m_aParams;
    
    public function __construct($oConnection, $aParams) {
        parent::__construct($oConnection);
        $this->m_aParams = $aParams;
    }
    
    protected function validate()
    {
        $bSuccess = !empty($this->m_aParams["arduino_id"]);
        $bSuccess = $bSuccess && is_numeric($this->m_aParams["arduino_id"]);
        $bSuccess = $bSuccess && intval($this->m_aParams["arduino_id"]) >= 0;
        
        if(!$bSuccess)
        {
            $this->setError("arduino_id must exist and be a nonnegative integer", 244);
        }
        return $bSuccess;
    }
    
    protected function execute()
    {
        $oArduinoTable = new ArduinoTable($this->m_oConnection);
        $oData = $oArduinoTable->get($this->m_aParams["arduino_id"]);
        
        $bSuccess = true;
        if($oArduinoTable->hasError())
        {
            $bSuccess = false;
            $this->mergeErrors($oArduinoTable->getErrors());
            $this->setStatusCode(500);
        }
        else 
        {
            $this->setData($oData);
        }
        
        return $bSuccess;
    }
}
