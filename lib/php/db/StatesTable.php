<?php
/**
 * @author zmiller
 */
class StatesTable extends BaseTable {
    
    public function insert($grow, $component, $state) {
        $sql = 
<<<EOD
            INSERT INTO states
            (date, grow_id, component, state)
            VALUES
            (NOW(), $grow, $component, $state);
EOD;
        
        return $this->execute($sql);
    }
    
    public function select($grow, $component) {
        $sql = 
<<<EOD
            SELECT arduino_constants.name, state as value, date  
            FROM states
            LEFT JOIN arduino_constants 
            ON states.component = arduino_constants.id
            WHERE grow_id = $grow
            AND component = $component
            ORDER BY date DESC;
EOD;
        
        return $this->execute($sql);
    }
}
