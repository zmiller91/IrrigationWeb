<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of BaseClass
 *
 * @author Miller
 */
class BaseTable implements Errorable{

    private $conn;
    private $m_aErrors;
    
    public function __construct($conn) {
        $this->conn = $conn;
        $this->m_aErrors = array();
    }
    
    /*
     * Executes a query. Returns array of associative arrays if any 
     * mysqli_results exist.
     */
    public function execute($strQuery){

        try
        {
            $result = $this->conn->query($strQuery);
        }
        catch (Exception $e)
        {
            $this->setError($e->getMessage());
            $result = false;
        }
        //If there's an error in the query then die
        if(!$result){
            $this->setError($strQuery);
            $result = false;
        }
        
        //If there is a mysqli_result then return it
        if($result && $result instanceof mysqli_result){
            return mysqli_fetch_all($result, MYSQLI_ASSOC);
        }
        
        return $result;
    }
    
    /*
     * Returns ID of last insert
     */
    public function selectLastInsertID(){
        $result = $this->execute("SELECT LAST_INSERT_ID() as 'id';");
        return $result[0]['id'];
    }
    
    public function getErrors() 
    {
        return $this->m_aErrors;
    }
    
    public function setError($error)
    {
        array_push($this->m_aErrors, $error);
    }
    
    public function hasError() {
        return !empty($this->m_aErrors);
    }
    
    public function mergeErrors($aErrors) {
        $this->m_aErrors = array_merge($this->m_aErrors, $aErrors);
    }
    
    protected function arrayToIN($aIn) {
        return "(" . implode(",", $aIn ) . ")";
    }
}
