const Answer = require("../models/answerModel");

export default (io,socket,connect) => {
  socket.on("saveAnswer", (answer) => {
    connect.then((db) => {
      const questionId = answer.questionId;
      try {
        let newAnswer = new Answer({
          questionId: answer.questionId,
          answer: answer.answer,
          writer: answer.writer,
        });

        newAnswer.save((err, doc) => {
          if (err)
            return res.json({
              success: false,
              err,
            });

            Answer.find({
              questionId: questionId,
            })
              .populate("writer")
              .exec((err, doc) => {
                return io.emit("savedAnswerList", doc);
              });

          Answer.find({})
            .populate("writer")
            .exec((err, doc) => {
              return io.emit("Output Answerlist", doc);
            });
        });
      } catch (error) {
        console.log(error);
      }
    });
  });
  socket.on("answer list output", () => {
    connect.then(async (db) => {
      const answers = await Answer.find({}).populate(["writer", "questionId"]);
      if (answers) {
        return io.emit("Output Answerlist", answers);
      } else {
        res.status(404).send({
          message: "Answer Not Found.",
        });
      }
    });
  });
  socket.on("answer like", (data) => {
    connect.then(async (db) => {
      const { answerId, wholiked } = data;
      const answer = await Answer.findById(answerId);
      answer.likes.push(wholiked);
      const likedAnswer = await answer.save();
      if (likedAnswer) {
        const newAnswer = await Answer.find().populate([
          "writer",
          "questionId",
          "wholiked"
        ]);
        return io.emit("Output like", newAnswer);
      }
    });
  });
  socket.on("answer unlike", (data) => {
    connect.then(async (db) => {
      const { answerId, wholiked } = data;
      const answer = await Answer.findById(answerId);
      answer.likes.splice(answer.likes.findIndex( like => like._id === wholiked) , 1);
      const unLikedAnswer = await answer.save();
      if (unLikedAnswer) {
        const newAnswer = await Answer.find().populate([
          "writer",
          "questionId",
          "wholiked"
        ]);
        return io.emit("Output unlike", newAnswer);
      }
    });
  });
  socket.on("questionAnswers", (questionId) => {
    connect.then(async (db) => {
      const answers = await Answer.find({
        questionId: questionId,
      }).populate(["writer", "questionId"]);
      if (answers) {
        return io.emit("questionAnswerList", answers);
      } else {
        res.status(404).send({
          message: "Answer Not Found.",
        });
      }
    });
  });
}