CREATE TABLE grow
(
	id int not null auto_increment,
    user_id int(11),
    arduino_id int(11),
    name varchar(256),
    active tinyint,
    created_date timestamp,
    
    primary key(id),
    foreign key(user_id) references user(id),
    foreign key(arduino_id) references arduino(id),
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

INSERT INTO arduino_constants
(id, name)
VALUES
(1008, "Fans");

INSERT INTO arduino_constants
(id, name)
VALUES
(1009, "Heater");