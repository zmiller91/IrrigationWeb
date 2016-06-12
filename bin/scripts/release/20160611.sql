
USE irrigation;

ALTER TABLE arduino
ADD COLUMN conf blob;

ALTER TABLE arduino
ADD COLUMN  created_date datetime;

ALTER TABLE arduino
ADD COLUMN  modified_date datetime;

SET SQL_SAFE_UPDATES = 0;
UPDATE arduino
set conf = "{}",
created_date = NOW(),
modified_date = NOW();
SET SQL_SAFE_UPDATES = 1;
        
INSERT INTO arduino_constants (name, id) VALUES("CONF_ON_OFF", 5000);
INSERT INTO arduino_constants (name, id) VALUES("CONF_MIN", 5001);
INSERT INTO arduino_constants (name, id) VALUES("CONF_MAX", 5002);
INSERT INTO arduino_constants (name, id) VALUES("CONF_TIME_ON", 5003);
INSERT INTO arduino_constants (name, id) VALUES("CONF_TIME_OFF", 5004);


SELECT * FROm serial;