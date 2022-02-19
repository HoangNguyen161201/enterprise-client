const mongoose = require('mongoose');

//Define schema model
const userSchema = new mongoose.Schema({
  employee_id: {
    type: Number,
    min: 1,
    default: 1,
    unique: true
  },
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
    default: null,
  },
});

//Increment employee ID users
userSchema.pre('save', async function (next) {
  let maxQuery
  try {
    maxQuery = await mongoose
    .model('users', userSchema)
    .find({})
    .sort({ employee_id: -1 })
    .limit(1)
    .then((users) => users[0].employee_id);
  } catch (error) {
    //Check exist model users
    if(error.name !== "TypeError"){
      next(error)
    }
  }
  if (maxQuery) {
    this.employee_id = ++maxQuery;
  }
  next();
});

module.exports = mongoose.model('users', userSchema);
