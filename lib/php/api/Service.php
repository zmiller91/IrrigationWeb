<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Service
 *
 * @author zmiller
 */
abstract class Service implements Errorable{
    
    protected $m_oConnection;
    
    private $m_mData;
    private $m_aErrors;
    private $m_iStatusCode;
    protected $m_oUser;
    protected $m_aInput;
    
    public function __construct($oConnection, $aInput)
    {
        $this->m_oConnection = $oConnection;
        $this->m_aInput = $aInput;
        $this->m_mData = null;
        
        $this->m_aErrors = array();
        $this->m_iStatusCode = 200;
        
        $this->m_oUser = array();
    }
    
    public function run()
    {
        $bSuccess = $this->validate() && $this->execute();
        $this->marshal();
                
        return $bSuccess;
    }
    
    public function hasError()
    {
        return !empty($this->m_aErrors);
    }
    
    public function getErrors()
    {
        return $this->m_aErrors;
    }
    
    public function setError($mError, $iStatusCode = null)
    {
        array_push($this->m_aErrors, $mError);
        $this->setStatusCode($iStatusCode);
    }
    
    public function mergeErrors($aErrors) {
        $this->m_aErrors = array_merge($this->m_aErrors, $aErrors);
    }
    
    protected function setData($mData)
    {
        $this->m_mData = $mData;
    }
    
    protected function setStatusCode($iStatusCode)
    {
        if(isset($iStatusCode) && is_int($iStatusCode))
        {
            $this->m_iStatusCode = $iStatusCode;
        }
    }
    
    private function marshal()
    {
        http_response_code($this->m_iStatusCode);
        
        $oOut = array();
        if($this->hasError())
        {
            Connection::rollback($this->m_oConnection);
            $oOut = $this->m_aErrors;
        }
        else 
        {
            Connection::commit($this->m_oConnection);
            $oOut = $this->m_mData;
        }

        echo json_encode($oOut);
    }
    
    /**
     * Returns true if the user input is valid, otherwise false. 
     * 
     * @return boolean
     */
    abstract protected function authorize();
    abstract protected function validate();
    abstract protected function execute();
}
