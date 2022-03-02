const nodemailer = require('nodemailer');
const mailNotice = require('../utils/mailNotice');

//import Midlleware
const catchAsyncError = require('../helpers/catchAsyncError');
const userModel = require('../models/userModel');

const sendMailController = {
  commentNotice: catchAsyncError(async (req, res) => {
    const { email } = req.body;

    await mailNotice({
      email,
      subject: 'You received a new comment',
      text: 'Your ideas got new comment',
      html: '<p style="text-align:center;color:red">Enterprise Web</p>',
    });
    return res.status(200).json({
      statusCode: 200,
      msg: 'Send email success',
    });
  }),
  ideaNotice: catchAsyncError(async (req, res) => {
    const { user_Id } = req.body;

    const data = await userModel.findById(user_Id);

    const qa_coordinator = await userModel.findOne({
      department_id: data.department_id,
      role: "qa_coordinator"
    })
   
    
    if (qa_coordinator) {
      await mailNotice({
        email: qa_coordinator.email,
        subject: 'Department got new idea',
        text: 'Department got new idea',
        html: '<p style="text-align:center;color:red">Enterprise Web</p>',
      });
    }
    return res.status(200).json({
      statusCode: 200,
      msg: 'Send email success',
    });
  }),
  departmentNotice: catchAsyncError(async (req, res) => {
    const { email } = req.body;

    await mailNotice({
      email,
      subject: 'you have been added to department',
      text: 'you have been added to department',
      html: '<p style="text-align:center;color:red">Enterprise Web</p>',
    });
    return res.status(200).json({
      statusCode: 200,
      msg: 'Send email success',
    });
  }),
};

module.exports = sendMailController;
