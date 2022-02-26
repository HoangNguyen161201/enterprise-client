const mongoose = require('mongoose');

//Define schema
const replySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },

    content: {
      required: true,
      type: String,
    },

    anonymously: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    idea_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ideas',
      required: true,
    },
    replies: {
      default: [],
      type: [replySchema],
    },
    anonymously: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('comments', commentSchema);
