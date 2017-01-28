<?php
/**
 * @author zmiller
 */
class Journal extends Service{
    protected function allowableMethods() {
        return [self::GET, self::POST, self::DELETE, self::PATCH];
    }

    protected function authorize() {
        return true;
    }

    protected function validate() {
        return true;
    }

    public function post() {
        $JournalTable = new JournalTable($this->m_oConnection);
        $JournalTable->insert("1", $this->m_aInput["text"]);
        $this->m_mData = $JournalTable->select("1");
        return true;
    }
    
    public function get() {
        $JournalTable = new JournalTable($this->m_oConnection);
        $this->m_mData = $JournalTable->select("1");
        return true;
    }
    
    public function delete() {
        $record = $this->m_aInput["record"];
        $JournalTable = new JournalTable($this->m_oConnection);
        $JournalTable->delete("1", $record["id"]);
        $this->m_mData = $JournalTable->select("1");
        return true;
    }
    
    public function patch() {
        $record = $this->m_aInput["record"];
        $JournalTable = new JournalTable($this->m_oConnection);
        $JournalTable->update("1", $record);
        $this->m_mData = $JournalTable->select("1");
        return true;
    }
}
