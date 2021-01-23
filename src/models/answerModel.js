const mongoose = require("mongoose");


const LikesSchema = new mongoose.Schema(
  {
    wholiked: { type: mongoose.Schema.Types.ObjectId },
  });

// answer schema
const answerScheama = new mongoose.Schema(
  {
    answer: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      trim: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [LikesSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Answer", answerScheama);
