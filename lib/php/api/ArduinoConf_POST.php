<?php

class ArduinoConf_POST extends Service
{
    
    public function __construct($oConnection, $aInput)
    {
        parent::__construct($oConnection, $aInput);
    }

    protected function authorize() {
        return true;
    }
    
    protected function validate()
    {
        // The post data must have a changelog and the changelog must be an 
        // array.  An arduino id must also be present, it must be a nonnegative
        // integer
        $bSuccess = isset($this->m_aInput)
                && isset($this->m_aInput["changelog"])
                && is_array($this->m_aInput["changelog"])
                && isset($this->m_aInput["arduino_id"])
                && is_numeric($this->m_aInput["arduino_id"])
                && intval($this->m_aInput["arduino_id"]) >= 0;
        
        foreach($this->m_aInput["changelog"] as $component => $conf)
        {
            // The keys must be arduino constants and the value must
            // be an array
            $bSuccess = $bSuccess 
                    && is_numeric($component) 
                    && ArduinoConstants::exists(intval($component))
                    && is_array($conf);
            
            foreach($conf as $action => $value)
            {
                // The keys must be arduino constants and the value must
                // be an array
                $bSuccess = $bSuccess
                        && is_numeric($action)
                        && ArduinoConstants::exists(intval($action))
                        && is_numeric($value)
                        && intval($value) >= 0;
            }
        }
                
        if(!$bSuccess)
        {
            $this->setError("Post data invalid.", 422);
        }
                
        return $bSuccess;
    }
    
    protected function execute()
    {
        // Get data from the db
        $oArduinoTable = new ArduinoTable($this->m_oConnection);
        $oArduino = $oArduinoTable->get($this->m_aInput["arduino_id"]);
        
        // Do a replace
        $oChangelog = $this->m_aInput["changelog"];
        foreach($oChangelog as $key => $value)
        {
            $oArduino["conf"][$key] = $value;
        }
        // Put back into db
        $oArduinoTable->put($oArduino["id"], $oArduino["conf"]);
        
        // Return success or failure
        $bSuccess = true;
        if($oArduinoTable->hasError())
        {
            $bSuccess = false;
            $this->mergeErrors($oArduinoTable->getErrors());
            $this->setStatusCode(500);
        }
        else
        {
            $this->setStatusCode(204);
        }
        return $bSuccess;
    }
}