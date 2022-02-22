const mongoose = require('mongoose');

//Define schema model
const reactionTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
});

module.exports = mongoose.model('reactiontypes', reactionTypeSchema);
