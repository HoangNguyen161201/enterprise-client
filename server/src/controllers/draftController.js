//Import middleware
const catchAsyncError = require('../helpers/catchAsyncError');

//Import model
const draftModel = require('../models/draftModel');
const submissionModel = require('../models/submissionModel');
const userModel = require('../models/userModel');

const draftController = {
  create: catchAsyncError(async (req, res) => {
    const { user_id, submission_id, title, description, content, anonymously } = req.body;

    //Check exist user
    const user = await userModel.findOne({
      _id: user_id,
      deleted: false,
    });

    if (!user)
      return res.status(400).json({
        err: 'User not exist in the system.',
        statusCode: 400,
      });

    //Check exist submission
    const submission = await submissionModel.findById(submission_id);

    if (!submission)
      return res.status(400).json({
        err: 'Submission not exist in the system.',
        statusCode: 400,
      });

    //Delete oldDraft
    await draftModel.deleteMany({
      user_id,
      submission_id,
    });

    //Create new Draft
    const newDraft = await draftModel.create({
      user_id,
      submission_id,
      title,
      description,
      content,
      anonymously,
    });

    await newDraft.save();

    return res.status(200).json({
      statusCode: 200,
      msg: 'Save draft success.',
    });
  }),

  getDraft: catchAsyncError(async (req, res) => {
    const { user_id, submission_id } = req.params;

    //Check exist draft
    const draft = await draftModel.findOne({
      user_id,
      submission_id,
    });

    return res.status(200).json({
      statusCode: 200,
      msg: 'Get draft success.',
      draft,
    });
  }),
};

module.exports = draftController;
