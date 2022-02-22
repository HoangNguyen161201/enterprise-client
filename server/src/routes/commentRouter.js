const express = require('express');

//Import controller
const commentController = require('../controllers/commentController');

//Create comment router
const commentRouter = express.Router();

//Import middleware
const authorization = require('../middlewares/authorization');

commentRouter.post('/', commentController.create);

commentRouter.put('/:comment_id', commentController.update);

commentRouter.delete('/:comment_id', commentController.delete);

module.exports = commentRouter;