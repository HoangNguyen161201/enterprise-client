const express = require('express');

//Import controller
const commentController = require('../controllers/commentController');

//Create comment router
const commentRouter = express.Router();

//Import middleware
const authorization = require('../middlewares/authorization');

commentRouter.post(
  '/',
  authorization(['qa_manager', 'qa_coordinator', 'department_manager', 'staff']),
  commentController.create
);

commentRouter.put(
  '/:comment_id',
  authorization(['qa_manager', 'qa_coordinator', 'department_manager', 'staff']),
  commentController.update
);

commentRouter.delete(
  '/:comment_id',
  authorization(['qa_manager', 'qa_coordinator', 'department_manager', 'staff']),
  commentController.delete
);

commentRouter.get(
  '/idea/:idea_id',
  authorization(['qa_manager', 'qa_coordinator', 'department_manager', 'staff']),
  commentController.getCommentsByDetail
);

module.exports = commentRouter;
