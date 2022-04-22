const express = require('express');
const { listQuestions } = require('./postgres/database');

const app = express();
const port = 3000;

// (1) List Questions
app.get('/qa/questions', async (req, res) => {
  console.log('Request Received!');
  const responseObject = await listQuestions(req.query.product_id);
  res.send(responseObject);
});

// (2) List Answers
app.get('/qa/questions/:question_id/answers', async (req, res) => {
  console.log('Request Received!');
  console.log(req.params.question_id); // Use req.params to access route parameters
  // const responseObject = await listAnswers(req.query.product_id);
  // res.send(responseObject);
  res.send('Hello!');
});

// (3) Add Question
app.post('/qa/questions', async (req, res) => {
  console.log('Request Received!');
  const responseObject = await addQuestion(req.query.product_id);
  res.send(responseObject);
});

// (4) Add Answer
app.post('/qa/questions/:question_id/answers', async (req, res) => {
  console.log('Request Received!');
  const responseObject = await addAnswer(req.query.product_id);
  res.send(responseObject);
});

// (5) Mark Question Helpful
app.put('/qa/questions/:question_id/helpful', async (req, res) => {
  console.log('Request Received!');
  const responseObject = await markQuestionHelpful(req.query.product_id);
  res.send(responseObject);
});

// (6) Report Question
app.put('/qa/questions/:question_id/report', async (req, res) => {
  console.log('Request Received!');
  const responseObject = await reportQuestion(req.query.product_id);
  res.send(responseObject);
});

// (7) Mark Answer Helpful
app.put('/qa/answers/:answer_id/helpful', async (req, res) => {
  console.log('Request Received!');
  const responseObject = await markAnswerHelpful(req.query.product_id);
  res.send(responseObject);
});

// (8) Report Answer
app.put('/qa/answers/:answer_id/report', async (req, res) => {
  console.log('Request Received!');
  const responseObject = await reportAnswer(req.query.product_id);
  res.send(responseObject);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
