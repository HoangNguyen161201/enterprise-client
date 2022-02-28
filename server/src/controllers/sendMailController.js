const nodemailer = require('nodemailer');

//import Midlleware
const catchAsyncError = require('../helpers/catchAsyncError');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hoangdev161201@gmail.com',
    pass: 'kingspear1999',
  },
  from: 'hoanghpang@gmail.com',
  port: 465,
  secure: true,
});


const sendMailController = {
    commentNotice: catchAsyncError(async (req, res) => {
        
    })
};
