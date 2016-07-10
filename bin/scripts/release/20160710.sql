
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