const mongoose = require('mongoose');
const dotEnv = require('dotenv')
dotEnv.config()

//Function connection database
const db = () => {
  mongoose.connect(process.env.URL_MONGODB).then(result=> {
    console.log('connect success')
  }).catch(err=> {
    console.log(err)
  })
};

module.exports = db