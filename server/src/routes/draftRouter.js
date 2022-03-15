const express = require('express');

//import controllers
const draftController = require('../controllers/draftController');

//Create draftRouter
const draftRouter = express.Router();

//Import middleware
const authorization = require('../middlewares/authorization');

//Handle draft routes
draftRouter.post('/', draftController.create);

draftRouter.get('/user/:user_id/submission/:submission_id', draftController.getDraft);

module.exports = draftRouter;
