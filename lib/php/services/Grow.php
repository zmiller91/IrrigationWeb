<?php
/**
 * @author zmiller
 */
class Grow extends Service {

    protected function allowableMethods() {
        return array(self::GET, self::PUT, self::PATCH);
    }

    protected function authorize() {
        return true;
    }

    protected function validate() {
        return true;
    }
    
    protected function patch() {
        $grow = $this->m_aInput['grow'];
        $updates = $this->m_aInput['updates'];
        
        $GrowTable = new Growtable($this->m_oConnection);
        $grow = $GrowTable->select(null, $grow, null);
        $grow = !empty($grow) ? $grow[0] : null;
        if(!isset($grow)) {
            return false;
        }
        
        $user = $grow["user_id"];
        foreach ($updates as $col => $value) {
            $GrowTable->update($grow['id'], $col, $value);
        }
        
        $this->m_mData = $GrowTable->select($user, null, null);
        return true;
    }
    
    protected function put() {
        $grow = $this->m_aInput;
        $GrowTable = new Growtable($this->m_oConnection);
        $id = $GrowTable->insert("1", $grow["controller"], $grow["name"]);
        $this->m_mData = $GrowTable->select(null, $id);
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
