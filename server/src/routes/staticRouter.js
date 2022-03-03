const express = require('express');

//Import controller
const staticController = require('../controllers/staticController');

//Create reaction router
const staticRouter = express.Router();

//Import middleware
const authorization = require('../middlewares/authorization');

staticRouter.get('/status-ideas', staticController.statusIdeas);
staticRouter.get('/many-idea', staticController.hasManyIdeas);
staticRouter.get('/top-view', staticController.topView);
staticRouter.get('/count', staticController.countAll);
staticRouter.get('/percent-idea', staticController.percentIdea);
staticRouter.get('/anonymously', staticController.anonymously);
staticRouter.get('/accept', staticController.accept);
staticRouter.get('/numberOPC', staticController.numberOPC);
staticRouter.get('/idea-By-Date', staticController.ideaByDate);

module.exports = staticRouter;
