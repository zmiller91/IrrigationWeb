<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ConfigruationTable
 *
 * @author zmiller
 */
class ArduinoTable extends BaseTable
{
    private $m_aArduino;
    
    public function __construct($oConnection)
    {
        parent::__construct($oConnection);
    }
    
    public function get($iArduinoId)
    {
        $mSuccess = true;
        if(!isset($this->m_aArduino))
        {
            $mSuccess = $this->execute( 
<<<EOD
            SELECT *
            FROM arduino
            WHERE id = $iArduinoId;
EOD
            );
            
            if($mSuccess !== false)
            {
                $this->m_aArduino = $mSuccess;
                $this->m_aArduino[0]["conf"] = json_decode($this->m_aArduino[0]["conf"], true);
            }
            
        }
        return $mSuccess ? $this->m_aArduino[0] : false;
    }
    
    public function put($iArduinoId, $oConfiguration)
    {
        $conf = json_encode($oConfiguration);
        return $this->execute(
<<<EOD
            UPDATE arduino
            SET conf = '$conf',
            modified_date = NOW()
            WHERE id = $iArduinoId;
EOD
        );
    }
}
