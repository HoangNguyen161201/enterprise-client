const mongoose = require('mongoose');

//Define schema model
const submissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
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
});

module.exports = mongoose.model('submissions', submissionSchema);