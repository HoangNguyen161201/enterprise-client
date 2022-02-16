const express = require('express');

//import controllers
const submissionController = require('../controllers/submissionControllers');

//creat submissionRouter
const submissionRouter = express.Router();

//Handle submission routes
submissionRouter.post('/', submissionController.create);

submissionRouter.put('/:id', submissionController.update);

submissionRouter.delete('/:id', submissionController.delete);

submissionRouter.get('/', submissionController.getAll);

submissionRouter.get('/:id', submissionController.getDetail);

module.exports = submissionRouter;
