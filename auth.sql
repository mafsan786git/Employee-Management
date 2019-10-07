-- CREATE DATABASE authentication;
-- use authentication;
-- show tables;


-- CREATE TABLE login (
--     id int NOT NULL AUTO_INCREMENT,
--     email VARCHAR(225),
--     password VARCHAR(225),
--     flag VARCHAR(225),
--     PRIMARY KEY (id) 
-- );
-- ALTER TABLE login MODIFY flag VARCHAR(225) NOT NULL;
-- describe login;
-- select * from `login`;
-- ALTER TABLE `login` AUTO_INCREMENT = 1;
-- DELETE from login;
-- UPDATE login SET id = 1 WHERE id = 2;

-- CREATE TABLE admin (
--         id int NOT NULL AUTO_INCREMENT,
--         fname VARCHAR(225),
--         lname VARCHAR(225),
--         email VARCHAR(225) NOT NULL,
--         gender VARCHAR(225),
--         password VARCHAR(225),
--         PRIMARY KEY (id)
-- );

-- describe `admin`;
-- DELETE from `admin`;
-- TRUNCATE TABLE admin;
-- ALTER TABLE `admin` AUTO_INCREMENT = 1;
-- ALTER TABLE `admin` DROP COLUMN `password`;

-- drop table admin;
-- ALTER TABLE user RENAME TO admin;
-- SELECT * FROM `admin` ;
-- show tables;


-- FOR MANAGER
-- ALTER TABLE manager DROP FOREIGN KEY manager_ibfk_1;
-- ALTER TABLE `manager` ADD CONSTRAINT manager_fk FOREIGN KEY (adminId) REFERENCES admin(id) ON DELETE CASCADE;
-- ALTER TABLE `manager` AUTO_INCREMENT = 1;
-- ALTER TABLE `user` DROP COLUMN `password`;

-- CREATE TABLE manager (
--         id int NOT NULL AUTO_INCREMENT,
--         fname VARCHAR(225),
--         lname VARCHAR(225),
--         email VARCHAR(225) NOT NULL,
--         gender VARCHAR(225),
--         password VARCHAR(225),
--         adminId int,
--         PRIMARY KEY (id),
--         FOREIGN KEY (adminId) REFERENCES admin(id)

-- );
-- SELECT * FROM `manager`;
-- show tables;
-- describe manager;

-- FOR USER
-- ALTER TABLE user DROP FOREIGN KEY user_ibfk_1;
-- ALTER TABLE `user` AUTO_INCREMENT = 1;
-- CREATE TABLE user (
--         id int NOT NULL AUTO_INCREMENT,
--         fname VARCHAR(225),
--         lname VARCHAR(225),
--         email VARCHAR(225) NOT NULL,
--         gender VARCHAR(225),
--         password VARCHAR(225),
--         managerId int,
--         PRIMARY KEY (id),
--         FOREIGN KEY (managerId) REFERENCES manager(id)

-- );
-- ALTER TABLE user ADD CONSTRAINT user_fk FOREIGN KEY (managerId) REFERENCES manager(id) ON DELETE CASCADE;
-- show tables;
-- SELECT * FROM `user` ;
-- DELETE from `user`;
-- describe admin;
-- describe manager;
-- describe user;