const ideaValid = require('../utils/ideaValid');

//import middleware
const catchAsyncError = require('../helpers/catchAsyncError');

//Import Model
const ideaModel = require('../models/ideaModel');

const ideaController = {
  create: catchAsyncError(async (req, res) => {
    //get info idea to create
    const {
      title,
      description,
      content,
      created_date,
      last_modified_date,
      user_id,
      category_id,
      submission_id,
    } = req.body;

    //check valid info input
    const errMsg = ideaValid.ideaFillIn({
      title,
      description,
      content,
      created_date,
      last_modified_date,
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
      created_date,
      last_modified_date,
      user_id,
      category_id,
      submission_id,
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

  getAll: catchAsyncError(async (req, res) => {
      
    //get all submission by field
    
  })
};
