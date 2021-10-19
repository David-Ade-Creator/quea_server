const Question = require("./models/questionModel");

export default (io,socket) => {
    const getQuestions = () => {
        const questions = await Question.find({}).populate("whoasked");
      if (questions) {
        return io.emit("Output Questionlist", questions);
      } else {
        res.status(404).send({
          message: "Questions Not Found.",
        });
      }
    }

    socket.on("question:get", getQuestions);
}