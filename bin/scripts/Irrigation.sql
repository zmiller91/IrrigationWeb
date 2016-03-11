
CREATE DATABASE irrigation;
USE irrigation;


create table user(
    id int not null auto_increment,
    username varchar(256),
    password varchar(256),
    created_date datetime,
    primary key (id),
    unique(username)
);

CREATE TABLE arduino (
	id int not null auto_increment,
    user_id int,
	primary key (id),
    foreign key (user_id) references user (id)
);

CREATE TABLE serial(
	id int not null auto_increment,
    arduino_id int,
    process int, 
    type int,
    value int,
    date datetime,

	primary key (id),
    foreign key(arduino_id) references arduino(id),
    foreign key(process) references arduino_constants(id),
    foreign key(type) references arduino_constants(id),
    index `process_key` (arduino_id, process, date),
    index `type_key` (arduino_id, type, date),
    index `process_type` (arduino_id, process, type, date)
);

CREATE TABLE arduino_constants(
	id int not null,
    name varchar(256),
    primary key (id)
);

INSERT INTO arduino_constants (name, id) VALUES("ON_OFF", 1);
INSERT INTO arduino_constants (name, id) VALUES("POLL_RESULTS", 2);
INSERT INTO arduino_constants (name, id) VALUES("PUMP_ID", 1000);
INSERT INTO arduino_constants (name, id) VALUES("PERI_PUMP_ID", 1001);
INSERT INTO arduino_constants (name, id) VALUES("MIXER_ID", 1002);
INSERT INTO arduino_constants (name, id) VALUES("PHDOWN_ID", 1003);
INSERT INTO arduino_constants (name, id) VALUES("PHUP_ID", 1004);
INSERT INTO arduino_constants (name, id) VALUES("SOLENOID_ID", 1005);
INSERT INTO arduino_constants (name, id) VALUES("LIGHT_ID", 1006);
INSERT INTO arduino_constants (name, id) VALUES("FAN_ID", 1007);
INSERT INTO arduino_constants (name, id) VALUES("POLL_ID", 2000);
INSERT INTO arduino_constants (name, id) VALUES("IRRIGATE_ID", 2001);
INSERT INTO arduino_constants (name, id) VALUES("ILLUMINATE_ID", 2002);
INSERT INTO arduino_constants (name, id) VALUES("MOISTURE_SENSOR_ID", 3000);
INSERT INTO arduino_constants (name, id) VALUES("PHOTORESISTOR_ID", 3001);
INSERT INTO arduino_constants (name, id) VALUES("TEMP_SENSOR_ID", 3002);
INSERT INTO arduino_constants (name, id) VALUES("MEM_USAGE_ID", 4000);

SELECT * FROM SERIAL;

select value, date from serial
LEFT JOIN arduino_constants 
on serial.process = arduino_constants.id
WHERE arduino_constants.id = 3002
AND serial.type = 2;
