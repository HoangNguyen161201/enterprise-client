const express = require('express');

//Import controller
const reactionTypeController = require('../controllers/reactionTypeController');

//Create reaction router
const reactionTypeRouter = express.Router();

//Import middleware
const authorization = require('../middlewares/authorization');

reactionTypeRouter.get('/', reactionTypeController.getAll);

module.exports = reactionTypeRouter;
