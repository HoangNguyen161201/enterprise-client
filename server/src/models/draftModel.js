const mongoose = require('mongoose');

//define schema model
const draftSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },

    description: {
      type: String,
    },

    content: {
      type: String,
    },

    anonymously: {
      type: Boolean,
      default: false,
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },

    submission_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'submissions',
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model('drafts', draftSchema);
