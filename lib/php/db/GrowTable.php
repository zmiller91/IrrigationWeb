<?php

/**
 * @author zmiller
 */
class GrowTable extends BaseTable {
    
    public function insert($userId, $controllerId, $name) {
        $sql = 
<<<EOD
        INSERT INTO grow
        (user_id, controller_id, name, active, created_date)
        VALUES
        ($userId, '$controllerId', '$name', 1, NOW());
EOD;
        
        $this->execute($sql);
        return $this->selectLastInsertID();
    }
    
    public function select($userId, $growId = null, $controllerId = null) {
        
        $growFilter = isset($growId) ? "AND grow_id = $growId" : "";
        $controllerFilter = isset($controllerId) ? "AND controller_id = $controllerId" : "";
        $sql = 
<<<EOD
        SELECT *  
        FROM grow
        WHERE user_id = $userId
        $growFilter
        $controllerFilter;
EOD;
        
        return $this->execute($sql);
    }
}
