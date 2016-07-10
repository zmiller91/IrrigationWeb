
USE irrigation;

CREATE TABLE user_sessions(
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