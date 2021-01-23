const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config.js");
const authRoute = require("./routes/authenticationRoutes");
const questionRoute = require("./routes/questionRoutes");
const answerRoute = require("./routes/answerRoutes");
const uploadRoute = require("./routes/uploadRoutes");
const userRoute = require("./routes/userRoutes");
const Answer = require("./models/answerModel");
const Question = require("./models/questionModel");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const mongodbUrl = config.MONGODB_URL;

const connect = mongoose
  .connect(
    mongodbUrl,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    console.log("connected")
  )
  .catch((error) => console.log(error.reason));

app.use(bodyParser.json());
app.use(cors());
app.use("/api/q3/", authRoute);
app.use("/api/q3/", questionRoute);
app.use("/api/q3/", answerRoute);
app.use("/api/q3/", uploadRoute);
app.use("/api/q3/", userRoute);

io.on("connection", (socket) => {
  socket.on("question list output", () => {
    connect.then(async (db) => {
      const questions = await Question.find({}).populate("whoasked");
      if (questions) {
        return io.emit("Output Questionlist", questions);
      } else {
        res.status(404).send({
          message: "Questions Not Found.",
        });
      }
    });
  });
  socket.on("questions", (question) => {
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

          Question.find({})
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
});

server.listen(config.PORT, () => {
  console.log(`server started at ${config.PORT}`);
});
