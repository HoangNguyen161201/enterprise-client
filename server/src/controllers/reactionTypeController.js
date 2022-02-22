//Import middleware
const catchAsyncError = require('../helpers/catchAsyncError');

//Import model
const reactionTypeModel = require('../models/reactionTypeModel');


const reactionTypeController = {
  getAll: catchAsyncError(async (req, res) => {
    const reactionTypes = await reactionTypeModel.find({});

    return res.status(200).json({
      statusCode: 200,
      msg: `Get all reaction type success.`,
      reactionTypes: reactionTypes,
    });
  }),
};

module.exports = reactionTypeController;
