const mongoose = require('mongoose');

//Define schema model
const reactionSchema = new mongoose.Schema({
  created_date: {
    type: Date,
    default: () => Date.now(),
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
  reactionType_id: {
    type: String,
    ref: 'reactionTypes',
    required: true,
  },
});

module.exports = mongoose.model('reactions', reactionSchema);
