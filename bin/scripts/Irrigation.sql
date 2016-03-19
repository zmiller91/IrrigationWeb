
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

CREATE TABLE arduino_constants(
	id int not null,
    name varchar(256),
    primary key (id)
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

INSERT INTO arduino_constants (name, id) VALUES("ON_OFF", 1);
INSERT INTO arduino_constants (name, id) VALUES("POLL_RESULTS", 2);
INSERT INTO arduino_constants (name, id) VALUES("Irrigation Pum", 1000);
INSERT INTO arduino_constants (name, id) VALUES("Food pump", 1001);
INSERT INTO arduino_constants (name, id) VALUES("Water Mixer", 1002);
INSERT INTO arduino_constants (name, id) VALUES("PH Down Pump", 1003);
INSERT INTO arduino_constants (name, id) VALUES("PH Up Pump", 1004);
INSERT INTO arduino_constants (name, id) VALUES("Solenoid Valve", 1005);
INSERT INTO arduino_constants (name, id) VALUES("Light", 1006);
INSERT INTO arduino_constants (name, id) VALUES("Fan", 1007);
INSERT INTO arduino_constants (name, id) VALUES("POLL_ID", 2000);
INSERT INTO arduino_constants (name, id) VALUES("IRRIGATE_ID", 2001);
INSERT INTO arduino_constants (name, id) VALUES("ILLUMINATE_ID", 2002);
INSERT INTO arduino_constants (name, id) VALUES("MOISTURE_SENSOR_ID", 3000);
INSERT INTO arduino_constants (name, id) VALUES("PHOTORESISTOR_ID", 3001);
INSERT INTO arduino_constants (name, id) VALUES("TEMP_SENSOR_ID", 3002);
INSERT INTO arduino_constants (name, id) VALUES("MEM_USAGE_ID", 4000);

INSERT INTO user
(username, password, created_date)
VALUES
("zmiller", "password", NOW());

INSERT INTO arduino
(user_id)
VALUES
(last_insert_id());

set @arduino_id = last_insert_id();

INSERT INTO serial
(arduino_id, process, type, value, date)
VALUES
(@arduino_id, 3000, 2, 150, '2015-08-08'),
(@arduino_id, 3001, 2, 65, '2015-08-08'),
(@arduino_id, 3002, 2, 21, '2015-08-08'),
(@arduino_id, 3000, 2, 135, '2015-08-09'),
(@arduino_id, 3001, 2, 45, '2015-08-09'),
(@arduino_id, 3002, 2, 18, '2015-08-09'),
(@arduino_id, 3000, 2, 123, '2015-08-20'),
(@arduino_id, 3001, 2, 76, '2015-08-20'),
(@arduino_id, 3002, 2, 19, '2015-08-10');
