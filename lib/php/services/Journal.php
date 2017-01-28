<?php
/**
 * @author zmiller
 */
class Journal extends Service{
    protected function allowableMethods() {
        return [self::GET, self::POST, self::DELETE];
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
}
