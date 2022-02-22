//Import middleware
const catchAsyncError = require('../helpers/catchAsyncError');

//Import model
const userModel = require('../models/userModel');
const ideaModel = require('../models/ideaModel');
const commentModel = require('../models/commentModel');

//Import valid
const commentValid = require('../utils/commentValid');

const commentController = {
  create: catchAsyncError(async (req, res) => {
    const { content, user_id, idea_id, comment_id } = req.body;

    //Check valid data
    const msgError = commentValid.createCommentValid({ content, user_id, idea_id });
    if (msgError)
      return res.status(400).json({
        statusCode: 400,
        err: msgError,
      });

    //Check exist id comment parent
    if (comment_id) {
      //Check exist parent comment
      const parentComment = await commentModel.findById(comment_id);
      if (!parentComment)
        return res.status(400).json({
          statusCode: 400,
          err: 'Parent comment does not exist in system.',
        });
    }

    //Check exist user
    const user = await userModel.findById(user_id);
    if (!user)
      return res.status(400).json({
        statusCode: 400,
        err: 'User does not exist in system.',
      });

    //Check exist idea
    const idea = await ideaModel.findById(idea_id);
    if (!idea)
      return res.status(400).json({
        statusCode: 400,
        err: 'Idea does not exist in system.',
      });

    //Save comment
    await commentModel.create({
      content,
      user_id,
      idea_id,
      comment_id: comment_id ? comment_id : null,
    });

    res.status(200).json({
      statusCode: 200,
      msg: 'Comment Success.',
    });
  }),

  update: catchAsyncError(async (req, res) => {
    const { comment_id } = req.params;

    const { content } = req.body;

    //Check valid data
    const msgError = commentValid.updateCommentValid({ content });
    if (msgError)
      return res.status(400).json({
        statusCode: 400,
        err: msgError,
      });

    //Check exist comment
    const comment = await commentModel.findById(comment_id);
    if (!comment)
      return res.status(400).json({
        statusCode: 400,
        err: 'Comment does not exist in system.',
      });

    //Update comment
    comment.content = content;
    await comment.save();

    return res.status(200).json({
      statusCode: 200,
      msg: 'Update comment success.',
    });
  }),

  delete: catchAsyncError(async (req, res) => {
    const { comment_id } = req.params;

    //Check exist comment
    const comment = await commentModel.findById(comment_id);
    if (!comment)
      return res.status(400).json({
        statusCode: 400,
        err: 'Comment does not exist in system.',
      });

    //Delete comment
    commentModel.findByIdAndDelete(comment_id)

    return res.status(200).json({
      statusCode: 200,
      msg: 'Delete comment success.',
    });
  }),
};

module.exports = commentController;
