<?php

/**
 * @author zmiller
 */
class Activities extends Service{
    
    protected function allowableMethods() {
        return array(self::GET, self::PUT);
    }

    protected function authorize() {
        return true;
    }

    protected function validate() {
        return true;
    }

    protected function get(){
        $this->m_mData = array(
            "light" => array(
                "id" => "2001", 
                "name" => "Light Schedule", 
                "state" => "on",
                "configuration" => array(
                    "5002" => "735",
                    "5003" => "645"
                )
            ),
                    
            "hvac" => array(
                "id" => "2003", 
                "name" => "Climate Control", 
                "state" => "on",
                "configuration" => array(
                    "5000" => "72",
                    "5001" => "77"
                )
            ),

            "irrigation" => array(
                "id" => "2002", 
                "name" => "Irrigation Control", 
                "state" => "off",
                "configuration" => array(
                    "5000" => "72"
                ),
                
                "components" => array(
                    "1001" => array("value" => "1", "scale" => "1.66"),
                    "1002" => array("value" => "15", "scale" => "1.66"),
                    "1003" => array("value" => "15", "scale" => "1.66"),
                    "1004" => array("value" => "5", "scale" => "1.66"),
                    "1005" => array("value" => "5", "scale" => "1.66")
                )
            )
        );
        
        return true;
    }
    
    protected function put() {
        return true;
    }
}
