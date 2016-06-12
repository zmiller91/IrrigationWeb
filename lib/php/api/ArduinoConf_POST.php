<?php

class ArduinoConf_POST extends Service
{
    protected $m_oPostData;
    
    public function __construct($oConnection, $oPostData)
    {
        parent::__construct($oConnection);
        $this->m_oPostData = $oPostData["data"];
    }
    
    protected function validate()
    {
        // The post data must have a changelog and the changelog must be an 
        // array.  An arduino id must also be present, it must be a nonnegative
        // integer
        $bSuccess = isset($this->m_oPostData)
                && isset($this->m_oPostData["changelog"])
                && is_array($this->m_oPostData["changelog"])
                && isset($this->m_oPostData["arduino_id"])
                && is_numeric($this->m_oPostData["arduino_id"])
                && intval($this->m_oPostData["arduino_id"]) >= 0;
        
        foreach($this->m_oPostData["changelog"] as $component => $conf)
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
        $oArduino = $oArduinoTable->get($this->m_oPostData["arduino_id"]);
        
        // Do a replace
        $oChangelog = $this->m_oPostData["changelog"];
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