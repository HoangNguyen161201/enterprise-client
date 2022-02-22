//Import middleware
const catchAsyncError = require('../helpers/catchAsyncError');

//Import model
const viewModel = require('../models/viewModel');
const userModel = require('../models/userModel');

const viewController = {
  create: catchAsyncError(async (req, res) => {
    const { user_id, idea_id } = req.body;

    //Check data create
    if (user_id && idea_id) {
      //Check exist user
      const user = await userModel.findById(user_id);
      if (!user)
        return res.status(400).json({
          statusCode: 400,
          err: 'User does not exist in system.',
        });

      //Check exist user view
      const view = await viewModel.findOne({
        user_id,
        idea_id,
      });

      if (view) {
        view.last_visited_date = Date.now();
        await view.save();
      } else {
        await viewModel.create({
          user_id,
          idea_id,
        });
      }
    }

    res.status(200).json({
      statusCode: 200,
      msg: 'Create new view success.',
    });
  }),

  delete: catchAsyncError(async (req, res) => {
    const { idea_id } = req.params;

    //Check data delete
    if (idea_id) {
      await viewModel.deleteMany({
        idea_id,
      });
    }

    res.status(200).json({
      statusCode: 200,
      msg: 'Delete view by idea success.',
    });
  }),
};

module.exports = viewController;
