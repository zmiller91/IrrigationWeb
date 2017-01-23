<?php
/**
 * @author zmiller
 */
class OverridesTable extends BaseTable{

    public function __construct($oConnection)
    {
        parent::__construct($oConnection);
    }
    
    public function select($growId, $components = null) {
        
        $extra = empty($components) ? "" :
                "AND component IN (".implode(",", $components).")";
        
        $sql = 
<<<EOD
        SELECT * 
        FROM overrides
        WHERE grow_id = $growId
        $extra; 
EOD;
        
        return $this->map($this->execute($sql), array("component"));
    }
    
    public function put($override) {
        $component = $override["id"];
        $state = $override["state"];
        $sql = 
<<<EOD
        INSERT INTO overrides
        (grow_id, component, value, modified_date)
        VALUES
        (1, $component, '$state', NOW())
        ON DUPLICATE KEY UPDATE
        value = '$state',
        modified_date = NOW();
EOD;
        
        $this->execute($sql);
    }
}
