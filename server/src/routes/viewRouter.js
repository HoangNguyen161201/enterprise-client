const express = require('express');

//Create viwe router
const viewRouter = express.Router();

//Import controller
const viewController = require('../controllers/viewController');

//Config routes
viewRouter.post('/', viewController.create);

viewRouter.delete('/:idea_id', viewController.delete);

module.exports = viewRouter;
