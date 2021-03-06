<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ArduinoConstants
 *
 * @author zmiller
 */
class ArduinoConstants {
    // Arduino Id
    const ARDUINO_ID = 2;

    // Serial types
    const ON_OFF = 1;
    const POLL_RESULTS = 2;
    const ADMIN = 3;

    // Component IDs. All component IDs start with 1000
    const PUMP_ID = 1000;
    const PERI_PUMP_ID = 1001;
    const MIXER_ID = 1002;
    const PHDOWN_ID = 1003;
    const PHUP_ID = 1004;
    const SOLENOID_ID = 1005;
    const LIGHT_ID = 1006;
    const FAN_ID = 1007;

    // Action IDs. All action IDs start with 2000
    const  POLL_ID = 2000;
    const IRRIGATE_ID = 2001;
    const ILLUMINATE_ID = 2002;

    // Sensor IDs. All sensor IDs start with 3000
    const MOISTURE_SENSOR_ID = 3000;
    const PHOTORESISTOR_ID = 3001;
    const TEMP_SENSOR_ID = 3002;

    // Admin/Debug/Other IDs.  All these IDs start with 4000
    const MEM_USAGE_ID = 4000;		
    
    // Configuration action types
    const CONF_ON_OFF = 5000;
    const CONF_MIN = 5001;
    const CONF_MAX = 5002;
    const CONF_TIME_ON = 5003;
    const CONF_TIME_OFF = 5004;

    static function exists($value) {
        $oClass = new ReflectionClass(__CLASS__);
        return array_search($value, $oClass->getConstants()) !== false;
    }
}
