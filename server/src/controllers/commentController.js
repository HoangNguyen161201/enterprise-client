//Import middleware
const catchAsyncError = require('../helpers/catchAsyncError');

//Import model
const userModel = require('../models/userModel');
const ideaModel = require('../models/ideaModel');
const commentModel = require('../models/commentModel');

//Import valid
const commentValid = require('../utils/commentValid');
const { default: Item } = require('antd/lib/list/Item');

const commentController = {
  create: catchAsyncError(async (req, res) => {
    const { content, user_id, idea_id, comment_id, anonymously } = req.body;

    //Check valid data
    const msgError = commentValid.createCommentValid({ content, user_id, idea_id });
    if (msgError)
      return res.status(400).json({
        statusCode: 400,
        err: msgError,
      });

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

    //Check exist id comment parent
    if (comment_id) {
      //Check exist parent comment
      const parentComment = await commentModel.findById(comment_id);
      if (!parentComment)
        return res.status(400).json({
          statusCode: 400,
          err: 'Parent comment does not exist in system.',
        });

      //Update replies when have parent comment
      parentComment.replies = [
        {
          user_id,
          content,
          anonymously
        },
        ...parentComment.replies,
      ];

      await parentComment.save();
    } else {
      //Save comment
      await commentModel.create({
        content,
        user_id,
        idea_id,
        anonymously
      });
    }

    res.status(200).json({
      statusCode: 200,
      msg: 'Comment Success.',
    });
  }),

  update: catchAsyncError(async (req, res) => {
    const { comment_id } = req.params;

    const { content, reply_id } = req.body;

    //Check valid data
    const msgError = commentValid.updateCommentValid({ content });
    if (msgError)
      return res.status(400).json({
        statusCode: 400,
        err: msgError,
      });

    //Check exist id comment parent
    if (reply_id) {
      //Check exist parent comment
      const comment = await commentModel.findById(comment_id);
      if (!comment)
        return res.status(400).json({
          statusCode: 400,
          err: 'Comment does not exist in system.',
        });

      //Update replies when have parent comment
      await commentModel.update(
        { _id: comment_id, 'replies._id': reply_id },
        {
          $set: {
            'replies.$.content': content,
          },
        }
      );
    } else {
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
    }

    return res.status(200).json({
      statusCode: 200,
      msg: 'Update comment success.',
    });
  }),

  delete: catchAsyncError(async (req, res) => {
    const { comment_id } = req.params;
    const { reply_id } = req.query;

    if (reply_id) {
      //Check exist parent comment
      const comment = await commentModel.findById(comment_id);
      if (!comment)
        return res.status(400).json({
          statusCode: 400,
          err: 'Comment does not exist in system.',
        });

      //Delete replies when have parent comment
      await commentModel.findByIdAndUpdate(comment_id, {
        $pull: {
          replies: { _id: reply_id },
        },
      });
    } else {
      //Check exist comment
      const comment = await commentModel.findById(comment_id);
      if (!comment)
        return res.status(400).json({
          statusCode: 400,
          err: 'Comment does not exist in system.',
        });

      //Delete comment
      await commentModel.findByIdAndDelete(comment_id);
    }

    return res.status(200).json({
      statusCode: 200,
      msg: 'Delete comment success.',
    });
  }),

  getCommentsByDetail: catchAsyncError(async (req, res) => {
    const { idea_id } = req.params;

    //Check exist idea
    const idea = await ideaModel.findById(idea_id);
    if (!idea)
      return res.status(400).json({
        statusCode: 400,
        err: 'Idea does not exist in system.',
      });

    //Get comments by idea
    const comments = await commentModel.find({
      idea_id,
    }).populate('user_id').populate({
      path: 'replies.user_id',
      model: 'users'
    });

    return res.status(200).json({
      statusCode: 200,
      msg: 'Get comments by idea success.',
      comments
    });
  }),
};

module.exports = commentController;
