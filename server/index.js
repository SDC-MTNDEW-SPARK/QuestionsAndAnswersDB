const express = require('express');
const { listQuestions } = require('./postgres/database');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/qa/questions', async (req, res) => {
  console.log('Request Received!');
  const responseObject = await listQuestions(req.query.product_id);
  res.send(responseObject);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
