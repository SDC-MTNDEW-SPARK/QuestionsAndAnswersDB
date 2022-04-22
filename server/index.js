const express = require('express');
const { listQuestions, listAnswers, listPhotos } = require('./postgres/database');

const app = express();
const port = 3000;

// (1) List Questions
app.get('/qa/questions', async (req, res) => {
  console.log(`Request Received! to ${req.originalUrl} with route params of ${JSON.stringify(req.params)} and query params of ${JSON.stringify(req.query)}`);
  const { product_id, page = 1, count = 5 } = req.query; // query parameters
  const responseObject = await listQuestions(product_id, page, count);
  res.send(responseObject);
});

// (2) List Answers
app.get('/qa/questions/:question_id/answers', async (req, res) => {
  console.log(`Request Received! to ${req.originalUrl} with route params of ${JSON.stringify(req.params)} and query params of ${JSON.stringify(req.query)}`);
  const { question_id } = req.params; // route parameters
  const { page = 1, count = 5 } = req.query; // query parameters
  const responseObject = await listAnswers(question_id, page, count);
  res.send(responseObject);
});

// (2)(b) List Answers/Photos [for testing only]
app.get('/qa/answers/:answer_id/photos', async (req, res) => {
  console.log(`Request Received! to ${req.originalUrl} with route params of ${JSON.stringify(req.params)} and query params of ${JSON.stringify(req.query)}`);
  const { answer_id } = req.params; // route parameters
  const { page = 1, count = 5 } = req.query; // query parameters
  const responseObject = await listPhotos(answer_id, page, count);
  res.send(responseObject);
});

// (3) Add Question
app.post('/qa/questions', async (req, res) => {
  console.log(`Request Received! to ${req.originalUrl} with route params of ${JSON.stringify(req.params)} and query params of ${JSON.stringify(req.query)}`);
  const responseObject = await addQuestion(req.query.product_id);
  res.send(responseObject);
});

// (4) Add Answer
app.post('/qa/questions/:question_id/answers', async (req, res) => {
  console.log(`Request Received! to ${req.originalUrl} with route params of ${JSON.stringify(req.params)} and query params of ${JSON.stringify(req.query)}`);
  const responseObject = await addAnswer(req.query.product_id);
  res.send(responseObject);
});

// (5) Mark Question Helpful
app.put('/qa/questions/:question_id/helpful', async (req, res) => {
  console.log(`Request Received! to ${req.originalUrl} with route params of ${JSON.stringify(req.params)} and query params of ${JSON.stringify(req.query)}`);
  const responseObject = await markQuestionHelpful(req.query.product_id);
  res.send(responseObject);
});

// (6) Report Question
app.put('/qa/questions/:question_id/report', async (req, res) => {
  console.log(`Request Received! to ${req.originalUrl} with route params of ${JSON.stringify(req.params)} and query params of ${JSON.stringify(req.query)}`);
  const responseObject = await reportQuestion(req.query.product_id);
  res.send(responseObject);
});

// (7) Mark Answer Helpful
app.put('/qa/answers/:answer_id/helpful', async (req, res) => {
  console.log(`Request Received! to ${req.originalUrl} with route params of ${JSON.stringify(req.params)} and query params of ${JSON.stringify(req.query)}`);
  const responseObject = await markAnswerHelpful(req.query.product_id);
  res.send(responseObject);
});

// (8) Report Answer
app.put('/qa/answers/:answer_id/report', async (req, res) => {
  console.log(`Request Received! to ${req.originalUrl} with route params of ${JSON.stringify(req.params)} and query params of ${JSON.stringify(req.query)}`);
  const responseObject = await reportAnswer(req.query.product_id);
  res.send(responseObject);
});

app.listen(port, () => {
  console.log(`Listening on Port ${port}...`);
});

// const dateObj = (new Date(1595884714409));
// console.log(count);
// console.log(dateObj);
