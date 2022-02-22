const express = require('express');

//Import controller
const reactionController = require('../controllers/reactionController');

//Create reaction router
const reactionRouter = express.Router();

//Import middleware
const authorization = require('../middlewares/authorization');

reactionRouter.post('/', reactionController.create);

module.exports = reactionRouter;
