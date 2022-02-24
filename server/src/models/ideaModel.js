const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  public_id: String,
  url: String,
});
//define schema model
const ideaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },

    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'categories',
      default: null,
    },

    submission_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'submissions',
      required: true,
    },
    files: {
      type: [fileSchema],
      default: [],
    },
    id_Cloudinary: {
      type: String,
    },
    anonymously: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model('ideas', ideaSchema);
