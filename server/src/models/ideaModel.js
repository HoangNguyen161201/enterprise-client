const mongoose = require('mongoose');

//define schema model
const submissionSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model('ideas', ideaSchema);
