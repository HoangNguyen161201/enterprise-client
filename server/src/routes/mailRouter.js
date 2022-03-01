const express = require('express');
const { send } = require('process');

//import controller
const sendMailController = require('../controllers/sendMailController');

//create categoryRouter
const mailRouter = express.Router();


//handle category routes
mailRouter.post('/', sendMailController.commentNotice);

mailRouter.post('/idea', sendMailController.ideaNotice)


module.exports = mailRouter;
