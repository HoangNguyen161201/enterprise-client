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
  staffs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      unique: true,
    },
  ],
  qa_manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  qa_coordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  department_manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  root: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('departments', departmentSchema);
