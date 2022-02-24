const mongoose = require('mongoose');

<<<<<<< HEAD
const fileSchema = new mongoose.Schema({
  public_id: String,
  url: String,
=======
//define schema model
const ideaSchema = new mongoose.Schema({
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

  created_date: {
    type: Date,
    required: true,
  },

  last_modified_date: {
    type: Date,
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
    required: true,
  },

  submission_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'submissions',
  },
>>>>>>> 070befc47cce51d3c1cf25a93723a8e34a44d811
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
  },

  { timestamps: true }
);

module.exports = mongoose.model('ideas', ideaSchema);
