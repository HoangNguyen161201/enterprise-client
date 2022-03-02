const express = require('express');
const { send } = require('process');

//import controller
const sendMailController = require('../controllers/sendMailController');

//create categoryRouter
const mailRouter = express.Router();

//handle category routes
mailRouter.post('/', sendMailController.commentNotice);

mailRouter.post('/ideas', sendMailController.ideaNotice);

mailRouter.post('/department', sendMailController.departmentNotice)

module.exports = mailRouter;
