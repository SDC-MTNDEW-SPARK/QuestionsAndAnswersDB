DROP DATABASE qa IF EXISTS;
CREATE DATABASE qa;
USE qa;

CREATE TABLE question (
  id INT NOT NULL AUTO_INCREMENT,
  product_id INT,
  body VARCHAR(127),
  date_written VARCHAR(31),
  asker_name VARCHAR(31),
  asker_email VARCHAR(63),
  reported BOOLEAN,
  helpful INT,
  -- Keys
  CONSTRAINT PRIMARY KEY (id)
)

CREATE TABLE answer (
  id INT NOT NULL AUTO_INCREMENT,
  question_id INT,
  body VARCHAR(127),
  date_written VARCHAR(31),
  answerer_name VARCHAR(31),
  answerer_email VARCHAR(63),
  reported BOOLEAN,
  helpful INT,
  -- Keys
  CONSTRAINT PRIMARY KEY (id),
  CONSTRAINT FOREIGN KEY (question_id) REFERENCES question (id)
)

CREATE TABLE photos (
  id INT NOT NULL AUTO_INCREMENT,
  answer_id INT,
  url VARCHAR(191)
  -- Keys
  CONSTRAINT PRIMARY KEY (id)
  CONSTRAINT FOREIGN KEY (answer_id) REFERENCES answer (id)
)
