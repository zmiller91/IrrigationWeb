<?php
/**
 * @author zmiller
 */
class PollTable extends BaseTable{
    
    public function insert($grow, $sensor, $value) {
        $sql = 
<<<EOD
            INSERT INTO polls
            (date, grow_id, sensor, reading)
            VALUES
            (NOW(), $grow, $sensor, $value);
EOD;
        
        return $this->execute($sql);
    }
    
}
