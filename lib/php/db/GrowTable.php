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
}
