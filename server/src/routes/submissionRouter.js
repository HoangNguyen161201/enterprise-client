const express = require('express');

//import controllers
const submissionController = require('../controllers/submissionControllers');

//creat submissionRouter
const submissionRouter = express.Router();

//Import middleware
const authorization = require('../middlewares/authorization');

//Handle submission routes
submissionRouter.post('/', authorization(['admin', 'qa_manager']), submissionController.create);

submissionRouter.put('/:id', authorization(['admin', 'qa_manager']), submissionController.update);

submissionRouter.delete('/:id',authorization(['admin', 'qa_manager']), submissionController.delete);

submissionRouter.get('/', authorization([]), submissionController.getAll);

submissionRouter.get('/all-id', submissionController.getAllId);

submissionRouter.get('/:id', authorization([]), submissionController.getDetail);

module.exports = submissionRouter;
