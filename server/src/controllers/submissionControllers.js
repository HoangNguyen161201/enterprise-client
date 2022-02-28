const submissionValid = require('../utils/submissionValid');
const moment = require('moment');

//Import middleware
const catchAsyncError = require('../helpers/catchAsyncError');

//Import model
const submissionModel = require('../models/submissionModel');
const ideaModel = require('../models/ideaModel');
const { update } = require('./userController');
const Filter = require('../utils/filter');
const pageIndex = require('../utils/PageIndex');

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
      background,
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
        err: ' The Topic does not exist',
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
      background,
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

    const ideas = await ideaModel.find({
      submission_id: id,
    });
    //check submission have any idea
    if (ideas && ideas.length !== 0)
      return res.status(400).json({
        err: 'Please delete all idea of this submission',
        statusCode: 400,
      });

    return res.status(200).json({
      statusCode: 200,
      msg: 'Delete Success',
    });
  }),

  getAll: catchAsyncError(async (req, res) => {
    // get all submission by field
    const { _page, _search, _time } = req.query;
    let filter = new Filter(submissionModel).getAll();
    if (_search) {
      filter = filter.search({ name: 'name', query: _search });
    }


    
    if (_time) {
      
    
      filter = filter.searchGte({ name: 'closure_date', query: _time });
    }
    if (_page) {
      filter = filter.pagination({ limit: 6, page: Number(_page) - 1 });
    }

    const page_Index = await pageIndex({ query: submissionModel, limit: 6 });
    const submissions = await filter.query;
    console.log('dfgfd')

    
    return res.status(200).json({
      statusCode: 200,
      submissions,
      page_Index,
      msg: 'Get all topic success',
    });
  }),

  getDetail: catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const submission = await submissionModel.findById(id);

    if (!submission)
      return res.status(400).json({
        err: 'The topic does not exist',
        statusCode: 400,
      });
    return res.status(200).json({
      statusCode: 200,
      msg: 'Get topic success',
      submission,
    });
  }),
};
module.exports = submissionController;
