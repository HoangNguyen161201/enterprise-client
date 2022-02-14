const mongoose = require('mongoose');

//Define schema model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['staff', 'admin', 'qa_manager', 'qa_coordinator', 'department_manager'],
    default: 'staff',
  },
  root: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: {
      public_id: String,
      url: String,
    },
  },
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'departments',
  },
});

module.exports = mongoose.model('users', userSchema);
