const mongoose = require('mongoose');
const { stringify } = require('querystring');

//Define schema model
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('category', categorySchema);
