<?php
/**
 * @author zmiller
 */
class Grow extends Service {

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
        $grow = $this->m_aInput;
        $GrowTable = new Growtable($this->m_oConnection);
        $grow["id"] = $GrowTable->insert("1", $grow["controller"], $grow["name"]);
        $this->m_mData = $grow;
        return true;
    }
    
    protected function get() {
        
        $user = $this->m_aInput["user"];
        $grow = isset($this->m_aInput["grow"]) ? $this->m_aInput["grow"] : null;
        $controller = isset($this->m_aInput["controller"]) ? $this->m_aInput["controller"] : null;
        
        $GrowTable = new Growtable($this->m_oConnection);
        $this->m_mData = $GrowTable->select($user, $grow, $controller);
        return true;
    }
}