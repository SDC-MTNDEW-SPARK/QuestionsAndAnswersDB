CREATE TABLE question (
  id SERIAL NOT NULL PRIMARY KEY,
  product_id INT,
  body VARCHAR(127),
  date_written VARCHAR(31),
  asker_name VARCHAR(31),
  asker_email VARCHAR(63),
  reported BOOLEAN,
  helpful INT
);

CREATE TABLE answer (
  id SERIAL NOT NULL PRIMARY KEY,
  question_id INT REFERENCES question(id),
  body VARCHAR(127),
  date_written VARCHAR(31),
  answerer_name VARCHAR(31),
  answerer_email VARCHAR(63),
  reported BOOLEAN,
  helpful INT
);

CREATE TABLE photos (
  id SERIAL NOT NULL PRIMARY KEY,
  answer_id INT REFERENCES answer(id),
  url VARCHAR(191)
);
