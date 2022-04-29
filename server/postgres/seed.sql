\COPY question FROM '/Users/elbert12/hackreactor/questionsandanswersdb/csv/questions.csv' DELIMITER ',' CSV HEADER;

\COPY answer FROM '/Users/elbert12/hackreactor/questionsandanswersdb/csv/answers.csv' DELIMITER ',' CSV HEADER;

\COPY photos FROM '/Users/elbert12/hackreactor/questionsandanswersdb/csv/answers_photos.csv' DELIMITER ',' CSV HEADER;
