//Import middleware
const catchAsyncError = require('../helpers/catchAsyncError');

//Import model
const reactionModel = require('../models/reactionModel');
const reactionTypeModel = require('../models/reactionTypeModel');
const userModel = require('../models/userModel');

//Import valid
const reactionValid = require('../utils/reactionValid');

const reactionController = {
  create: catchAsyncError(async (req, res) => {
    const { user_id, idea_id, reactionType_id } = req.body;
    console.log(reactionType_id);

    //Check valid data
    const msgError = reactionValid.createReactionValid({
      user_id,
      idea_id,
      reactionType_id,
    });
    if (msgError)
      return res.status(400).json({
        err: msgError,
        statusCode: 400,
      });

    //Check exist user
    const user = await userModel.findById(user_id);
    if (!user)
      return res.status(400).json({
        statusCode: 400,
        err: 'User does not exist in system.',
      });

    //Check exist reactionType
    const reactionType = await reactionTypeModel.findById(reactionType_id);
    console.log(reactionType);
    if (!reactionType)
      return res.status(400).json({
        statusCode: 400,
        err: 'Reaction type does not exist in system.',
      });


    //Check exist reaction, if exist will delete
    const reactTion = await reactionModel.findOne({
      user_id,
      idea_id,
      reactionType_id,
    });

    if (reactTion) {
      await reactionModel.findByIdAndDelete(reactTion._id);

      return res.status(200).json({
        statusCode: 200,
        msg: 'Unreaction success.',
      });
    }

    //Create reaction
    await reactionModel.create({
      user_id,
      idea_id,
      reactionType_id,
    });

    return res.status(200).json({
        statusCode: 200,
        msg: `${reactionType.name} success.`,
      });
  }),
};

module.exports = reactionController;
