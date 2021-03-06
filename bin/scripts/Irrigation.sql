
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

create table user_sessions(
    id int not null auto_increment,
    user int,
    token varchar(256),
    expiration datetime,
    persist tinyint,
    primary key (id),
    foreign key (user) references user(id),
    index (id, user),
    created_date datetime,
    updated_date datetime
);

CREATE TABLE arduino (
    id int not null auto_increment,
    user_id int,
    conf blob,
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

CREATE TABLE arduino_conf(
    arduino_id int not null,
    conf blob
    
    primary key(arduino_id)
);

CREATE TABLE changelog(
    id int not null auto_increment,
    arduino_id int,
    arduino_const int,
    value int,
    start_date date,
    end_date date,
    primary key(id),
    foreign key(arduino_id) references arduino(id),
    foreign key(component) references arduino_constants(id),
    foreign key(state) references arduino_constants(id),
    index `component` (arduino_id, component, start_date),
    index `state` (arduino_id, component, state, start_date)
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


INSERT INTO user
(username, password, created_date)
VALUES
("zmiller", "password", NOW());

INSERT INTO arduino
(user_id)
VALUES
(last_insert_id());
