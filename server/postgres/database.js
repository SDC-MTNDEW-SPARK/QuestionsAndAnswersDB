const { Client, Pool } = require('pg');
require('dotenv').config();

const credentials = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  dbname: process.env.PGDATABASE,
  password: process.env.PG_PASS,
  port: process.env.PGPORT,
};

console.log('process.env.PG_USER', process.env.PGUSER);
console.log('process.env.PGHOST', process.env.PGHOST);
console.log('process.env.PG_DB,', process.env.PGDATABASE);
console.log('process.env.PG_ENDPOINT,', process.env.PGPORT);

const pool = new Pool(credentials);

// (1) List Questions, when given a product ID... Object-Built-By-JavaScript-Version
async function listQuestionsOFF(productID = 1, count = 5) {
  const returnObject = { product_id: productID };
  // await client.connect();
  const res = await pool.query(`
    SELECT
        id AS question_id,
        body AS question_body,
        to_json(to_timestamp(cast(date_written as decimal)/1000)) AS question_date,
        asker_name,
        helpful AS question_helpfulness, reported
    FROM question
    WHERE product_id = ${Number(productID)}
    LIMIT ${Number(count)};
  `);
  // console.log(res.rows); // res.rows is an array of "rows" each corresponding to a question
  returnObject.results = res.rows;
  // for each resulting question, retrieve an array of answers and store that array in the .answers property in each element of .results
  await Promise.all(returnObject.results.map((e) => e.question_id).map(async (qid, i) => {
    const answers = await listAnswers(qid);
    console.log(answers.results);
    returnObject.results[i].answers = answers.results;
  }));
  // await client.end();
  return returnObject;
}

// Revision of (1) List Questions, when given a product ID
async function listQuestions(productID = 1, count = 5) {
  const returnObject = { product_id: productID };
  // await client.connect();
  const res = await pool.query(`
    SELECT
        question.id question_id,
        question.body question_body,
        to_json(to_timestamp(cast(question.date_written as decimal)/1000)) question_date,
        question.asker_name,
        question.helpful question_helpfulness,
        question.reported,
        COALESCE(json_object_agg(ap.id,
          json_build_object(
            'answer_id', ap.id,
            'body', ap.body,
            'date', to_json(to_timestamp(cast(ap.date_written as decimal)/1000)),
            'answerer_name', ap.answerer_name,
            'helpfulness', ap.helpful,
            'photos', ap.photographs
          )
        ) FILTER (WHERE ap.id IS NOT NULL), '{}') answers
    FROM question
    LEFT JOIN (
      SELECT
        answer.question_id,
        answer.id id,
        answer.body body,
        answer.date_written date_written,
        answer.answerer_name answerer_name,
        answer.helpful helpful,
        COALESCE(json_agg(
          json_build_object(
            'id', photos.id,
            'url', photos.url
          )
        ) FILTER (WHERE photos.id IS NOT NULL), '[]') photographs
      FROM
        answer
        LEFT JOIN photos
        ON answer.id = photos.answer_id
        GROUP BY answer.id
    ) ap ON question.id = ap.question_id
    WHERE product_id = ${Number(productID)}
    GROUP BY question.id
    LIMIT ${Number(count)};
  `);
  // console.log(res);
  returnObject.results = res.rows;
  // await pool.end();
  return returnObject;
}

// (2) List Answers, when given a question ID
async function listAnswers(questionID = 1, page = 0, count = 5) {
  // const client = new Client({
  //   database: 'qa',
  // });
  const returnObject = { question: questionID, page, count };
  // await pool.connect();
  const res = await pool.query(`
    SELECT
      id AS answer_id,
      body,
      to_json(to_timestamp(cast(date_written as decimal)/1000)) AS date,
      answerer_name,
      helpful AS helpfulness
    FROM answer
    WHERE question_id = ${Number(questionID)}
      AND reported = false
    LIMIT ${Number(count)};
  `);
  // console.log(res.rows); // res.rows is an array of "rows" each corresponding to an answer
  returnObject.results = res.rows;
  await Promise.all(returnObject.results.map((e) => e.answer_id).map(async (aid, i) => {
    const photos = await listPhotos(aid);
    console.log(photos);
    returnObject.results[i].photos = photos;
  }));
  // await client.end();
  return returnObject;
}

// (2)(b) List Photos, when given an answer ID
async function listPhotos(answerID = 1) {
  // const client = new Client({
  //   database: 'qa',
  // });
  // await client.connect();
  const res = await pool.query(`SELECT id, url FROM photos WHERE answer_id = ${Number(answerID)};`);
  // console.log(res.rows); // res.rows is an array of "rows" each corresponding to a question
  // await client.end();
  return res.rows;
}

// (3) Add Question
// This current does not work because of some issue with auto_increment
async function addQuestion(body, name, email, product_id) {
  const client = new Client({
    database: 'qa',
  });
  await client.connect();
  const query = `INSERT INTO question (product_id, body, date_written, asker_name, asker_email, reported, helpful) VALUES (${product_id}, ${body}, 'dsf8lksdjhf', ${name}, ${email}, false, 0);`;
  const res = await client.query(query); // replace with an insert into
  await client.end();
  return res;
}

// (4) Add Answer
// This current does not work because of some issue with auto_increment
async function addAnswer(question_id, body, name, email, photos) {
  const client = new Client({
    database: 'qa',
  });
  await client.connect();
  const query = `INSERT INTO answer (question_id, body, date_written, answerer_name, answerer_email, reported, helpful) VALUES (${question_id}, ${body}, 'dsf8lksdjhf', ${name}, ${email}, false, 0);`;
  const res = await client.query(query); // replace with an insert into
  await client.end();
  return res;
}

// (5) Mark Question Helpful
async function markQuestionHelpful(question_id) {
  const client = new Client({
    database: 'qa',
  });
  await client.connect();
  const query = `UPDATE question SET helpful = helpful + 1 where id = ${question_id};`;
  const res = await client.query(query);
  await client.end();
  return res;
}

// (6) Report Question
async function reportQuestion(question_id) {
  const client = new Client({
    database: 'qa',
  });
  await client.connect();
  const query = `UPDATE question SET reported = true where id = ${question_id};`;
  const res = await client.query(query);
  await client.end();
  return res;
}

// (7) Mark Answer as Helpful
async function markAnswerHelpful(answer_id) {
  const client = new Client({
    database: 'qa',
  });
  await client.connect();
  const query = `UPDATE answer SET helpful = helpful + 1 where id = ${answer_id};`;
  const res = await client.query(query);
  await client.end();
  return res;
}

// (8) Report Answer
async function reportAnswer(answer_id) {
  const client = new Client({
    database: 'qa',
  });
  await client.connect();
  const query = `UPDATE answer SET reported = true WHERE id = ${answer_id};`;
  const res = await client.query(query);
  await client.end();
  return res;
}

module.exports = {
  listQuestions,
  listAnswers,
  listPhotos, // only for testing
  addQuestion,
  addAnswer,
  markQuestionHelpful,
  reportQuestion,
  markAnswerHelpful,
  reportAnswer,
};

// Example of complete Question response
// {
//   "product_id": "5",
//   "results": [{
//         "question_id": 37,
//         "question_body": "Why is this product cheaper here than other sites?",
//         "question_date": "2018-10-18T00:00:00.000Z",
//         "asker_name": "williamsmith",
//         "question_helpfulness": 4,
//         "reported": false,
//         "answers": {
//           68: {
//             "id": 68,
//             "body": "We are selling it here without any markup from the middleman!",
//             "date": "2018-08-18T00:00:00.000Z",
//             "answerer_name": "Seller",
//             "helpfulness": 4,
//             "photos": []
//             // ...
//           }
//         }
//       },
//       {
//         "question_id": 38,
//         "question_body": "How long does it last?",
//         "question_date": "2019-06-28T00:00:00.000Z",
//         "asker_name": "funnygirl",
//         "question_helpfulness": 2,
//         "reported": false,
//         "answers": {
//           70: {
//             "id": 70,
//             "body": "Some of the seams started splitting the first time I wore it!",
//             "date": "2019-11-28T00:00:00.000Z",
//             "answerer_name": "sillyguy",
//             "helpfulness": 6,
//             "photos": [],
//           },
//           78: {
//             "id": 78,
//             "body": "9 lives",
//             "date": "2019-11-12T00:00:00.000Z",
//             "answerer_name": "iluvdogz",
//             "helpfulness": 31,
//             "photos": [],
//           }
//         }
//       },
//       // ...
//   ]
// }

// Example of complete answer response... note the photos array
// {
//   "question": "1",
//   "page": 0,
//   "count": 5,
//   "results": [
//     {
//       "answer_id": 8,
//       "body": "What a great question!",
//       "date": "2018-01-04T00:00:00.000Z",
//       "answerer_name": "metslover",
//       "helpfulness": 8,
//       "photos": [],
//     },
//     {
//       "answer_id": 5,
//       "body": "Something pretty durable but I can't be sure",
//       "date": "2018-01-04T00:00:00.000Z",
//       "answerer_name": "metslover",
//       "helpfulness": 5,
//       "photos": [{
//           "id": 1,
//           "url": "urlplaceholder/answer_5_photo_number_1.jpg"
//         },
//         {
//           "id": 2,
//           "url": "urlplaceholder/answer_5_photo_number_2.jpg"
//         },
//         // ...
//       ]
//     },
//     // ...
//   ]
// }
