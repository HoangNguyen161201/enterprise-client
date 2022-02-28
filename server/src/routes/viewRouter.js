const express = require('express');

//Create viwe router
const viewRouter = express.Router();

//Import controller
const viewController = require('../controllers/viewController');

//Import middleware
const authorization = require('../middlewares/authorization');

//Config routes
viewRouter.post('/', authorization([]), viewController.create);

viewRouter.delete('/:idea_id', viewController.delete);

module.exports = viewRouter;
 