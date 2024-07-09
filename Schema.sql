DROP DATABASE IF EXISTS `madcamp_week2_db`;

CREATE DATABASE `madcamp_week2_db`;
USE madcamp_week2_db;


DROP TABLE IF EXISTS `MUSIC`;
CREATE TABLE IF NOT EXISTS `MUSIC`(
    id int auto_increment primary key,
    genre varchar(255),
    music_name varchar(255),
    artist varchar(255),
    music_rate integer
);

DROP TABLE IF EXISTS `USER_INFO`;
CREATE TABLE IF NOT EXISTS `USER_INFO` (
    id integer auto_increment primary key,
    user_name text,
    following_user_id varchar(255),
    following_user_pw varchar(255),
    coin integer,
    user_preferences varchar(255),
    login_method varchar(5),
    login_token_id varchar(255)
);



DROP TABLE IF EXISTS `USER_PREFERENCES`;
CREATE TABLE IF NOT EXISTS `USER_PREFERENCES` (
    user_id int,
    music_id int,
    FOREIGN KEY (user_id) REFERENCES USER_INFO(id),
    FOREIGN KEY (music_id) REFERENCES MUSIC(id),
    PRIMARY KEY (user_id, music_id)
);