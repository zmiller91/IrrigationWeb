<?php

/**
 * @author zmiller
 */
class ControllerTable extends BaseTable {
    
    function insert($userId, $serialNumber) {
        $sql = 
<<<EOD
        INSERT INTO controllers
        (user_id, serial_number, created_date)
        VALUES
        ($userId, '$serialNumber', NOW());
EOD;
        return $this->execute($sql);
    }
    
    function select($userId) {
        $sql = 
<<<EOD
        SELECT * 
        FROM controllers
        WHERE user_id = $userId;
EOD;
        return $this->execute($sql);
    }
}
