<?php
/**
 * @author zmiller
 */
class JournalTable extends BaseTable {
    
    public function insert($growId, $message) {
        $m = $this->escape($message);
        $sql = 
<<<EOD
        INSERT INTO journal
        (grow_id, text, date)
        VALUES
        ($growId, "$m", NOW());
EOD;
        
        return $this->execute($sql);
    }
    
    public function select($growId) {
        $sql = 
<<<EOD
        SELECT * FROM journal
        WHERE grow_id = $growId
        ORDER BY date DESC;
EOD;
        
        return $this->execute($sql);
    }
}
