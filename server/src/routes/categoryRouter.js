const express = require('express');

//import controller
const categoryController = require('../controllers/categoryController');

//create categoryRouter
const categoryRouter = express.Router();

//Import middleware
const authorization = require('../middlewares/authorization');

//handle category routes
categoryRouter.post('/', authorization(['admin', 'qa_manager']), categoryController.create);

categoryRouter.put('/:id', authorization(['admin', 'qa_manager']), categoryController.update);

categoryRouter.delete('/:id', authorization(['admin', 'qa_manager']), categoryController.delete);

categoryRouter.get('/', authorization([]), categoryController.getAll);

categoryRouter.get('/:id', authorization([]), categoryController.getDetail);

module.exports = categoryRouter;
