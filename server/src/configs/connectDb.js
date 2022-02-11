const mongoose = require('mongoose');

//Function connection database
const db = () => {
  mongoose
    .connect('mongodb://localhost:27017/CMS')
    .then(() => {
      console.log('Connect Success DB');
    })
    .catch((err) => {
      console.log('Connect False DB', err);
    });
};

module.exports = db