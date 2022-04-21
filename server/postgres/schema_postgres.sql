DROP DATABASE qa IF EXISTS;
CREATE DATABASE qa;
USE qa;

CREATE TABLE question (
  product_id INT,
  question_id INT NOT NULL AUTO_INCREMENT,
  question_body VARCHAR(255),
  question_date VARCHAR(255),
  asker_name VARCHAR(255),
  question_helpfulness INT,
  question_reported BOOLEAN,
  -- Keys
  CONSTRAINT PRIMARY KEY (question_id)
)

CREATE TABLE answer (
  question_id INT,
  answer_id INT NOT NULL AUTO_INCREMENT,
  answer_body VARCHAR(255),
  answer_date VARCHAR(255),
  answerer_name VARCHAR(255),
  answer_helpfulness INT,
  answer_reported BOOLEAN,
  -- Keys
  CONSTRAINT PRIMARY KEY (answer_id),
  CONSTRAINT FOREIGN KEY (question_id) REFERENCES question (question_id)
)

CREATE TABLE usernames (
  user_id_num INT NOT NULL AUTO_INCREMENT,
  user_handle VARCHAR(255),
  user_email VARCHAR(255),
  -- Keys
  CONSTRAINT PRIMARY KEY (user_id_num)
)

CREATE TABLE photos (
  answer_id INT,
  photo_id INT NOT NULL AUTO_INCREMENT,
  photo_url VARCHAR(255)
  -- Keys
  CONSTRAINT PRIMARY KEY (photo_id)
  CONSTRAINT FOREIGN KEY (answer_id) REFERENCES answer (answer_id)
)