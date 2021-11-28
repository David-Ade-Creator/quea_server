const Question = require("../models/questionModel");

export default (io,socket,connect) => {
  socket.on("question list output", (req,res) => {
    connect.then(async (db) => {
      const questions = await Question.find({}).sort({"createdAt": -1}).populate("whoasked");
      if (questions) {
        return io.emit("Output Questionlist", questions);
      } else {
        res.status(404).send({
          message: "Questions Not Found.",
        });
      }
    });
  });
  socket.on("questions", (question,res) => {
    connect.then((db) => {
      try {
        const newQuestion = new Question({
          question: question.question,
          link: question.link,
          whoasked: question.whoasked,
        });

        newQuestion.save((err, doc) => {
          if (err)
            return res.json({
              success: false,
              err,
            });

          Question.find({}).sort({"createdAt": -1})
            .populate("whoasked")
            .exec((err, doc) => {
              return io.emit("Output Questionlist", doc);
            });
        });
      } catch (error) {
        console.log(error);
      }
    });
  });
}