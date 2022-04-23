const { Client } = require('pg');

// (1) List Questions, when given a product ID
async function listQuestions(productID = 1, count = 5) {
  const client = new Client({
    database: 'qa',
  });
  const returnObject = { product_id: productID };
  await client.connect();
  const res = await client.query(`SELECT id AS question_id, body AS question_body, date_written AS question_date, asker_name, helpful AS question_helpfulness, reported FROM question WHERE product_id = ${Number(productID)} limit ${Number(count)};`);
  // console.log(res.rows); // res.rows is an array of "rows" each corresponding to a question
  returnObject.results = res.rows;
  // for each resulting question, retrieve an array of answers and store that array in the .answers property in each element of .results
  await Promise.all(returnObject.results.map((e) => e.question_id).map(async (qid, i) => {
    const answers = await listAnswers(qid);
    console.log(answers.results);
    returnObject.results[i].answers = answers.results;
  }));
  await client.end();
  return returnObject;
}

// (2) List Answers, when given a question ID
async function listAnswers(questionID = 1, page = 0, count = 5) {
  const client = new Client({
    database: 'qa',
  });
  const returnObject = { question: questionID, page, count };
  await client.connect();
  const res = await client.query(`SELECT id AS answer_id, body, date_written AS date, answerer_name, helpful AS helpfulness FROM answer WHERE question_id = ${Number(questionID)} AND reported = false limit ${Number(count)};`);
  // console.log(res.rows); // res.rows is an array of "rows" each corresponding to an answer
  returnObject.results = res.rows;
  await Promise.all(returnObject.results.map((e) => e.answer_id).map(async (aid, i) => {
    const photos = await listPhotos(aid);
    console.log(photos);
    returnObject.results[i].photos = photos;
  }));
  await client.end();
  return returnObject;
}

// (2)(b) List Photos, when given an answer ID
async function listPhotos(answerID = 1) {
  const client = new Client({
    database: 'qa',
  });
  await client.connect();
  const res = await client.query(`SELECT id, url FROM photos WHERE answer_id = ${Number(answerID)};`);
  console.log(res.rows); // res.rows is an array of "rows" each corresponding to a question
  await client.end();
  return res.rows;
}

module.exports.listQuestions = listQuestions;
module.exports.listAnswers = listAnswers;
module.exports.listPhotos = listPhotos; // only for testing

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
