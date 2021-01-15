"use strict";

const Answer = require("../models/answerModel");

exports.saveAnswer = async (req, res) => {
  const {
    questionId,
    answer,
    writer
  } = req.body;
  const newAnswer = new Answer({
    questionId,
    answer,
    writer
  });
  const newAnswerCreated = await newAnswer.save();

  if (newAnswerCreated) {
    resAnswer = await Answer.find({
      _id: newAnswerCreated._id
    }).populate("writer");
    res.send(resAnswer);
  } else {
    res.status(404).send("unable to save answer");
  }
};

exports.readAnswers = async (req, res) => {
  const answer = await Answer.find({}).populate("writer");

  if (answer) {
    res.send(answer);
  } else {
    res.status(404).send({
      message: "Answer Not Found."
    });
  }
};

exports.readQuestionAnswers = async (req, res) => {
  const answer = await Answer.find({
    questionId: req.params.id
  }).populate("writer");

  if (answer) {
    res.send(answer);
  } else {
    res.status(404).send({
      message: "Answer Not Found."
    });
  }
};

exports.readUsersAnswers = async (req, res) => {
  const answers = await Answer.find({
    writer: req.params.id
  }).populate("writer");

  if (answers) {
    res.send(answers);
  } else {
    res.status(404).send({
      message: "Answers Not Found."
    });
  }
};