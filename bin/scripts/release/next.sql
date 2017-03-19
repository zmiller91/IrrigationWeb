drop table serial;
drop table arduino;
RENAME TABLE user TO users;

CREATE TABLE controllers
(
    serial_number varchar(256),
	user_id int(11),
    created_date datetime,
    
    primary key(serial_number),
    foreign key(user_id) references users(id),
    index `user` (user_id)
);

CREATE TABLE grow
(
	id int not null auto_increment,
    user_id int(11),
    controller_id varchar(256),
    name varchar(256),
    state int(1),
    created_date timestamp,
    
    primary key(id),
    foreign key(user_id) references users(id),
    foreign key(controller_id) references controllers(serial_number),
    index `user` (user_id, arduino_id)
);

CREATE TABLE overrides
(
    grow_id int(11),
    component int(11),
    value varchar(10),
    modified_date timestamp,
    
    primary key(grow_id, component),
    foreign key(grow_id) references grow(id),
    foreign key(component) references arduino_constants(id),
    index `grow` (grow_id)
);

CREATE TABLE journal
(
	id int not null auto_increment,
	grow_id int(11),
    text blob,
    edited_date datetime,
    created_date datetime,
    
    primary key(id),
    foreign key(grow_id) references grow(id),
    index `grow` (grow_id)
);

CREATE TABLE configuration
(
    grow_id int(11),
    component int(11),
    process int(11),
    value decimal(12, 2),
    scale varchar(10),
    modified_date timestamp,
    
    primary key(grow_id, component, process),
    foreign key(grow_id) references grow(id),
    foreign key(component) references arduino_constants(id),
    foreign key(process) references arduino_constants(id),
    index `grow` (grow_id)
);

CREATE TABLE polls 
(
    date datetime,
	grow_id int(11),
    sensor int(11),
    value float,
    
    primary key(date, grow_id, sensor),
    foreign key(grow_id) references grow(id),
    foreign key(sensor) references arduino_constants(id),
    index `grow` (grow_id, sensor)
);

CREATE TABLE states
(
    date datetime,
	grow_id int(11),
    component int(11),
    state int(11),
    
    primary key(date, grow_id, component),
    foreign key(grow_id) references grow(id),
    foreign key(component) references arduino_constants(id),
    index `grow` (grow_id, component)
);

UPDATE arduino_constants
set name = "Resevior Pump"
where id = 1000;

UPDATE arduino_constants
set name = "Water Pump"
where id = 1001;

UPDATE arduino_constants
set name = "Dosing Pump 1"
where id = 1002;

UPDATE arduino_constants
set name = "Dosing Pump 2"
where id = 1003;

UPDATE arduino_constants
set name = "Dosing Pump 3"
where id = 1004;

UPDATE arduino_constants
set name = "Dosing Pump 4"
where id = 1005;

UPDATE arduino_constants
set name = "Nutrient Mixer"
where id = 1006;

UPDATE arduino_constants
set name = "Lights"
where id = 1007;

UPDATE arduino_constants
set name = "Irrigation Control"
where id = 2001;

UPDATE arduino_constants
set name = "Light Schedule"
where id = 2002;

INSERT INTO arduino_constants
(id, name)
VALUES
(1008, "Fans");

INSERT INTO arduino_constants
(id, name)
VALUES
(1009, "Heater");

INSERT INTO arduino_constants
(id, name)
VALUES
(2003, "Climate Control");

INSERT INTO arduino_constants
(id, name)
VALUES
(3003, "Humidity Sensor");