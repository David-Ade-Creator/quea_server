const Answer = require("../models/answerModel");

export default (io, socket, connect) => {
  socket.on("saveAnswer", (answer, res) => {
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
          }).sort({"createdAt": -1}) 
            .populate(["writer", "questionId"])
            .exec((err, doc) => {
              return io.emit("savedAnswerList", doc);
            });

          Answer.find({}).sort({"createdAt": -1}) 
            .populate(["writer", "questionId"])
            .exec((err, doc) => {
              return io.emit("Output Answerlist", doc);
            });
        });
      } catch (error) {
        console.log(error);
      }
    });
  });
  socket.on("answer list output", (req, res) => {
    connect.then(async (db) => {
      const answers = await Answer.find({}).sort({"createdAt": -1}).populate(["writer", "questionId"]);
      if (answers) {
        return io.emit("Output Answerlist", answers);
      } else {
        res.status(404).send({
          message: "Answer Not Found.",
        });
      }
    });
  });
  socket.on("answer like", (data, res) => {
    connect.then(async (db) => {
      const { answerId, wholiked } = data;
      const answer = await Answer.findById(answerId);
      const liked = answer.likes.find(like => like._id = wholiked);
      if (liked) {
        answer.likes.splice(answer.likes.findIndex(like => like._id === wholiked), 1);
        const unLikedAnswer = await answer.save();
        if (unLikedAnswer) {
          const newAnswer = await Answer.find().sort({"createdAt": -1}).populate([
            "writer",
            "questionId",
            "wholiked"
          ]);
          return io.emit("Output Answerlist", newAnswer);
        }
      } else {
        answer.likes.push(wholiked);
        const likedAnswer = await answer.save();
        if (likedAnswer) {
          const newAnswer = await Answer.find().sort({"createdAt": -1}).populate([
            "writer",
            "questionId",
            "wholiked"
          ]);
          return io.emit("Output Answerlist", newAnswer);
        }
      }

    });
  });

  socket.on("questionAnswers", (questionId, res) => {
    connect.then(async (db) => {
      const answers = await Answer.find({
        questionId: questionId,
      }).sort({"createdAt": -1}).populate(["writer", "questionId"]);
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