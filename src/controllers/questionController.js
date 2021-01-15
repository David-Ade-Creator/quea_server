const Question = require("../models/questionModel");

exports.readQuestionController = async (req, res) => {
  const questions = await Question.find({}).populate("whoasked");
  if (questions) {
    res.send(questions);
  } else {
    res.status(404).send("Unable to fetch questions");
  }
};

exports.saveQuestionController = async (req, res) => {
  const newQuestion = new Question({
    question: req.body.question,
    link: req.body.link,
    whoasked: req.body.whoasked,
  });
  const newQuestionCreated = await newQuestion.save();
  if (newQuestionCreated) {
    const resQuestion = await Question.find({ _id: newQuestionCreated._id }).populate("whoasked");
    res.send(resQuestion);
  } else {
    res.status(404).send("Unable to save question");
  }
};

exports.readSingleQuestionController = async (req, res) => {
  const question = await Question.findOne({ _id: req.params.id }).populate(
    "whoasked"
  );
  if (question) {
    res.send(question);
  } else {
    res.status(404).send({ message: "Question Not Found." });
  }
};

exports.singleUserQuestionController = async (req, res) => {
  const questions = await Question.find({ whoasked: req.params.id }).populate(
    "whoasked"
  );
  if (questions) {
    res.send(questions);
  } else {
    res.status(404).send({ message: "Questions Not Found." });
  }
};
