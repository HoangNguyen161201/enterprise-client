const mongoose = require('mongoose');

//Define schema model
const submissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  description: {
    type: String,
    required: true,
  },

  closure_date: {
    type: Date,
    require: true,
  },

  final_closure_date: {
    type: Date,
    required: true,
  },

  background: {
    type: String,
    default: 'https://res.cloudinary.com/hoang161201/image/upload/v1645274633/Group_92_grzovc.svg',
  },
});

module.exports = mongoose.model('submissions', submissionSchema);
