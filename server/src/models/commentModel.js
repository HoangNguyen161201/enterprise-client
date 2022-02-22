const mongoose = require('mongoose');

//Define schema
const commentSchema = new mongoose.Schema({
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
  comment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comments',
    default: null,
  },
}, {timestamps: true});

module.exports = mongoose.model('comments', commentSchema);
