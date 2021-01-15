const express = require('express')
const router = express.Router()

// Load Controllers
const {
    readQuestionController,
    saveQuestionController,
    readSingleQuestionController,
    singleUserQuestionController
} = require('../controllers/questionController.js');


router.get("/question",readQuestionController)

router.post("/question",saveQuestionController)

router.get("/question/:id",readSingleQuestionController)

router.post("/question/:id/myquestions",singleUserQuestionController)

module.exports = router;