const express = require('express');

//Import controller
const staticController = require('../controllers/staticController');

//Create reaction router
const staticRouter = express.Router();

//Import middleware
const authorization = require('../middlewares/authorization');

staticRouter.get('/status-ideas', staticController.statusIdeas);

module.exports = staticRouter;
