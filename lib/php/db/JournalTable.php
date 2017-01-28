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
        (grow_id, text, created_date)
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
        ORDER BY created_date DESC;
EOD;
        
        return $this->execute($sql);
    }
    
    public function delete($growId, $entryId) {
        $sql = 
<<<EOD
        DELETE FROM journal
        WHERE grow_id = $growId
        AND id = $entryId;
EOD;
        
        return $this->execute($sql);
    }
    
    public function update($growId, $entry) {
        $entryId = $entry["id"];
        $text = $this->escape($entry["text"]);
        $sql = 
<<<EOD
        UPDATE journal
        SET text = "$text",
            edited_date = NOW()
        WHERE grow_id = $growId
        AND id = $entryId;
EOD;
        
        return $this->execute($sql);
    }
}
