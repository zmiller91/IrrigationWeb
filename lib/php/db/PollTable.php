<?php
/**
 * @author zmiller
 */
class PollTable extends BaseTable{
    
    public function insert($grow, $sensor, $value) {
        $sql = 
<<<EOD
            INSERT INTO polls
            (date, grow_id, sensor, value)
            VALUES
            (NOW(), $grow, $sensor, $value);
EOD;
        
        return $this->execute($sql);
    }
    
    public function getPoll($grow, $sensor)
    {
        $sql = 
<<<EOD
        SELECT date, value 
        FROM polls
        WHERE grow_id = $grow
        AND sensor = $sensor;
EOD;
        return $this->execute($sql);
    }
    
}
