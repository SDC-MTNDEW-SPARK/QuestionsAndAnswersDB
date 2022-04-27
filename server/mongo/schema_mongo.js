const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const photoSchema = new mongoose.Schema({
  id: Number,
  url: String,
});

const answerSchema = new mongoose.Schema({
  id: Number,
  body: String,
  date: String,
  answerer_name: String,
  answerer_email: String,
  answer_helpful: Number,
  reported: Boolean,
  photos: [photoSchema],
});

const questionSchema = new mongoose.Schema({
  question_id: Number,
  question_body: String,
  question_date: String,
  asker_name: String,
  asker_email: String,
  question_helpful: Number,
  reported: Boolean,
  answers: [answerSchema],
});

const question = mongoose.model('question', questionSchema);

module.exports.photoSchema = photoSchema;
module.exports.answerSchema = answerSchema;
module.exports.questionSchema = questionSchema;
module.exports.question = question;
