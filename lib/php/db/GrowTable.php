<?php

/**
 * @author zmiller
 */
class GrowTable extends BaseTable {
    
    public function insert($userId, $controllerId, $name) {
        $sql = 
<<<EOD
        INSERT INTO grow
        (user_id, controller_id, name, state, created_date)
        VALUES
        ($userId, '$controllerId', '$name', 2, NOW());
EOD;
        
        $this->execute($sql);
        return $this->selectLastInsertID();
    }
    
    public function select($userId = null, $growId = null, $controllerId = null) {
        
        $userFilter = isset($userId) ? "AND user_id = $userId" : "";
        $growFilter = isset($growId) ? "AND id = $growId" : "";
        $controllerFilter = isset($controllerId) ? "AND controller_id = $controllerId" : "";
        $sql = 
<<<EOD
        SELECT *  
        FROM grow
        WHERE state > -1
        $userFilter
        $growFilter
        $controllerFilter;
EOD;
        
        return $this->execute($sql);
    }
    
    public function update($growId, $col, $value) {
        $sql = 
<<<EOD
        UPDATE grow
        SET $col = '$value'
        where id = $growId;
EOD;
        
        return $this->execute($sql);
    }
}
