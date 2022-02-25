const ideaValid = require('../utils/ideaValid');

//import middleware
const catchAsyncError = require('../helpers/catchAsyncError');

//Import Model
const ideaModel = require('../models/ideaModel');
const Filter = require('../utils/filter');
const userModel = require('../models/userModel');
const { rmSync } = require('fs');
const submissionModel = require('../models/submissionModel');
const reactionModel = require('../models/reactionModel');

const ideaController = {
  create: catchAsyncError(async (req, res) => {
    //get info idea to create
    const {
      title,
      description,
      content,
      user_id,
      category_id,
      submission_id,
      anonymously,
      files,
      cloudinary_id,
    } = req.body;

    //check valid info input
    const errMsg = ideaValid.ideaFillIn({
      title,
      description,
      content,
      user_id,
      category_id,
      submission_id,
    });

    if (errMsg)
      return res.status(400).json({
        err: errMsg,
        statusCode: 400,
      });

    const NewIdea = new ideaModel({
      title,
      description,
      content,
      user_id,
      category_id: category_id ? category_id : null,
      submission_id,
      anonymously,
      files,
      cloudinary_id,
    });
    await NewIdea.save();

    return res.status(200).json({
      msg: 'Create idea success!',
      statusCode: 200,
    });
  }),

  update: catchAsyncError(async (req, res) => {
    //get id from query
    const { id } = req.params;

    //get info update
    const { title, description, content, last_modified_date, category_id } = req.body;

    //check idea exist in system
    const idea = await ideaModel.findById(id);

    if (!idea) {
      return res.status(400).json({
        err: 'The Idea does not exist',
        statusCode: 400,
      });
    }

    const ideaErr = ideaValid.ideaUpdate({
      title,
      description,
      content,
      last_modified_date,
      category_id,
    });

    if (ideaErr)
      return res.status(400).json({
        statusCode: 400,
        err: ideaErr,
      });

    //Update and response
    await ideaModel.findByIdAndUpdate(id, {
      title,
      description,
      content,
      last_modified_date,
      category_id,
      anoymous,
    });

    return res.status(200).json({
      statusCode: 200,
      msg: 'Update Success',
    });
  }),

  delete: catchAsyncError(async (req, res) => {
    const { id } = req.params;

    //check idea exist in system
    const idea = await ideaModel.findById(id);

    if (!idea)
      return res.status(400).json({
        err: 'The idea does not exist',
        statusCode: 400,
      });
    await ideaModel.findByIdAndDelete(id, req.body);

    return res.status(200).json({
      statusCode: 200,
      msg: 'Delete Success',
    });
  }),

  getByReaction: catchAsyncError(async (req, res) => {}),

  getAll: catchAsyncError(async (req, res) => {
    const { _sort, _sortBy } = req.query;
    let filter = new Filter(ideaModel);
    filter = filter.getAll();
    if (_sort) {
      filter = filter.sort({ name: _sortBy, NorO: _sort });
    }
    const data = await filter.query;
    return res.status(200).json({
      statusCode: 200,
      msg: 'Get All Success',
      data,
    });
  }),

  getDetail: catchAsyncError(async (req, res) => {
    const { id } = req.params;

    const idea = await ideaModel.findById(id);

    if (!idea)
      return res.status(400).json({
        err: 'The Idea does not exist',
        statusCode: 400,
      });
    return res.status(200).json({
      statusCode: '200',
      msg: ' Get topic success',
      idea,
    });
  }),

  deleteFile: catchAsyncError(async (req, res) => {
    const { public_id, id } = req.body;
    await ideaModel.findByIdAndUpdate(id, { $pull: { files: { public_id } } });
    return res.status(200).json({
      statusCode: 200,
      msg: 'Delete file success',
    });
  }),
  getIdeaOfUser: catchAsyncError(async (req, res) => {
    const { user_id } = req.params;
    const { submission_id } = req.query;

    const user = await userModel.findById(user_id);
    console.log(user);

    if (!user)
      return res.status(400).json({
        err: 'The user id dose not exist',
        statusCode: 400,
      });

    const submission = await submissionModel.findById(submission_id);
    if (!submission)
      return res.status(400).json({
        err: 'The submission id dose not exist',
        statusCode: 400,
      });

    const ideas = await ideaModel.find({ submission_id, user_id });
    return res.status(200).json({
      msg: 'Get ideas by user success',
      statusCode: 200,
      ideas,
    });
  }),
};

module.exports = ideaController;
