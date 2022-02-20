const mongoose = require('mongoose');

//Define schema model
const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  root: {
    type: Boolean,
    default: false,
  },
  count_users: {
    type: Number,
    default: 0,
    min: 0
  }
});

module.exports = mongoose.model('departments', departmentSchema);
