<?php
/**
 * @author zmiller
 */
class ConfigurationTable extends BaseTable{
    
    public function __construct($oConnection)
    {
        parent::__construct($oConnection);
    }
    
    public function select($growId, $components, $group = array("component", "process")) {
        
        $extra = empty($components) ? "" :
                "AND component IN (".implode(",", $components).")";
        
        $sql = 
<<<EOD
        SELECT * 
        FROM configuration
        WHERE grow_id = $growId
        $extra; 
EOD;
        
        return $this->map($this->execute($sql), $group);
    }
    
    public function put($configuration) {
        $component = $configuration["component"];
        $process = $configuration["process"];
        $value = $configuration["value"];
        $scale = $configuration["scale"];
        
        $sql = 
<<<EOD
        INSERT INTO configuration
        (grow_id, component, process, value, scale, modified_date)
        VALUES
        (1, $component, $process, $value, '$scale', NOW())
        ON DUPLICATE KEY UPDATE
        value = $value,
        modified_date = NOW();
EOD;
        
        $this->execute($sql);
    }
}
