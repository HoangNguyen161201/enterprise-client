const submissionValid = require('../utils/submissionValid');

//Import middleware
const catchAsyncError = require('../helpers/catchAsyncError');

//Import model
const submissionModel = require('../models/submissionModel');
const { update } = require('./userController');

const submissionController = {
  create: catchAsyncError(async (req, res) => {
    //get info submission to create
    const { name, description, closure_date, final_closure_date, background } = req.body;

    //check valid info input
    const errMsg = submissionValid.submissionFillIn({
      name,
      description,
      closure_date,
      final_closure_date,
    });

    if (errMsg)
      return res.status(400).json({
        err: errMsg,
        statusCode: 400,
      });

    //Create and save new topic
    const NewSubmission = new submissionModel({
      name,
      description,
      closure_date,
      final_closure_date,
      background
    });
    await NewSubmission.save();

    return res.status(200).json({
      msg: 'Create topic success!',
      statusCode: 200,
    });
  }),

  update: catchAsyncError(async (req, res) => {
    //get id from query
    const { id } = req.params;
    //get info update
    const { name, description, closure_date, final_closure_date, background } = req.body;

    //check topic exist in system
    const submission = await submissionModel.findById(id);

    if (!submission) {
      return res.status(400).json({
        err: ' The Topic is does not exist',
        statusCode: 400,
      });
    }
    
    //Check valid
    const submissionErr = submissionValid.submissionUpdate({
      name,
      description,
      closure_date,
      final_closure_date,
    });
    if (submissionErr)
      return res.status(400).json({
        statusCode: 400,
        err: submissionErr,
      });

    //Update and response
    await submissionModel.findByIdAndUpdate(id, {
      name,
      description,
      closure_date,
      final_closure_date,
      background
    });

    return res.status(200).json({
      statusCode: 200,
      msg: 'Update Success',
    });
  }),

  delete: catchAsyncError(async (req, res) => {
    const { id } = req.params;

    //check topic exist in system
    const submission = await submissionModel.findById(id);

    if (!submission)
      return res.status(400).json({
        err: 'The Topic is does not exist',
        statusCode: 400,
      });
    await submissionModel.findByIdAndDelete(id, req.body);

    return res.status(200).json({
      statusCode: 200,
      msg: 'Delete Success',
    });
  }),

  getAll: catchAsyncError(async (req, res) => {
    const submissions = await submissionModel.find({});
    return res.status(200).json({
      statusCode: 200,
      submissions,
      msg: 'Get all topic success',
    });
  }),

  getDetail: catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const submission = await submissionModel.findById(id);

    if (!submission)
      return res.status(400).json({
        err: 'The topic is does not exist',
        statusCode: 400,
      });
    return res.status(200).json({
      statusCode: '200',
      msg: 'Get topic success',
      submission,
    });
  }),
};
module.exports = submissionController;
