const express = require("express");
const router = express.Router();

const {
  saveAnswer,
  readQuestionAnswers,
  readUsersAnswers,
  readAnswers,
} = require("../controllers/answerController");

router.post("/answer", saveAnswer);

router.get("/answer", readAnswers);

router.get("/questionAnswer/:id", readQuestionAnswers);

router.get("/questionAnswer/:id/userAnswer", readUsersAnswers);

module.exports = router;