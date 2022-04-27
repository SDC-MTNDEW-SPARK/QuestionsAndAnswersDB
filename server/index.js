const express = require('express');
const {
  listQuestions,
  listAnswers,
  listPhotos,
  addQuestion,
  addAnswer,
  markQuestionHelpful,
  reportQuestion,
  markAnswerHelpful,
  reportAnswer,
} = require('./postgres/database');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  console.log(req.body);
  const {
    body,
    name,
    email,
    product_id,
  } = req.body;
  const responseObject = await addQuestion(body, name, email, product_id);
  console.log(responseObject);
  res.sendStatus(201);
});

// (4) Add Answer
app.post('/qa/questions/:question_id/answers', async (req, res) => {
  console.log(`Request Received! to ${req.originalUrl} with route params of ${JSON.stringify(req.params)} and query params of ${JSON.stringify(req.query)}`);
  console.log(req.body);
  const { question_id } = req.params;
  const {
    body,
    name,
    email,
    photos,
  } = req.body;
  const responseObject = await addAnswer(question_id, body, name, email, photos);
  console.log(responseObject);
  res.sendStatus(201);
});

// (5) Mark Question Helpful
app.put('/qa/questions/:question_id/helpful', async (req, res) => {
  console.log(`Request Received! to ${req.originalUrl} with route params of ${JSON.stringify(req.params)} and query params of ${JSON.stringify(req.query)}`);
  const { question_id } = req.params;
  const responseObject = await markQuestionHelpful(question_id);
  console.log(responseObject);
  res.sendStatus(204);
});

// (6) Report Question
app.put('/qa/questions/:question_id/report', async (req, res) => {
  console.log(`Request Received! to ${req.originalUrl} with route params of ${JSON.stringify(req.params)} and query params of ${JSON.stringify(req.query)}`);
  const { question_id } = req.params;
  const responseObject = await reportQuestion(question_id);
  console.log(responseObject);
  res.sendStatus(204);
});

// (7) Mark Answer Helpful
app.put('/qa/answers/:answer_id/helpful', async (req, res) => {
  console.log(`Request Received! to ${req.originalUrl} with route params of ${JSON.stringify(req.params)} and query params of ${JSON.stringify(req.query)}`);
  const { answer_id } = req.params;
  const responseObject = await markAnswerHelpful(answer_id);
  console.log(responseObject);
  res.sendStatus(204);
});

// (8) Report Answer
app.put('/qa/answers/:answer_id/report', async (req, res) => {
  console.log(`Request Received! to ${req.originalUrl} with route params of ${JSON.stringify(req.params)} and query params of ${JSON.stringify(req.query)}`);
  const { answer_id } = req.params;
  const responseObject = await reportAnswer(answer_id);
  console.log(responseObject);
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Listening on Port ${port}...`);
});

// const dateObj = (new Date(1595884714409));
// console.log(count);
// console.log(dateObj);
