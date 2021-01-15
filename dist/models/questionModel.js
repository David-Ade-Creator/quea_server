"use strict";

const mongoose = require('mongoose'); // question schema


const questionScheama = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  link: {
    type: String,
    trim: true
  },
  whoasked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Question', questionScheama);