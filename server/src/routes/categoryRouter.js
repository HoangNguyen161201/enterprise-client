const express = require('express');

//import controller
const categoryController = require('../controllers/categoryController');

//create categoryRouter
const categoryRouter = express.Router();

//Import middleware
const authorization = require('../middlewares/authorization');

//handle category routes
categoryRouter.post('/', authorization(['admin', 'qa_manager']), categoryController.create);

categoryRouter.post('/add-many', authorization(['admin', 'qa_manager']), categoryController.createMany);

categoryRouter.put('/:id', authorization(['admin', 'qa_manager']), categoryController.update);

categoryRouter.delete('/:id', authorization(['admin', 'qa_manager']), categoryController.delete);

categoryRouter.get('/', categoryController.getAll);

categoryRouter.get('/:id', categoryController.getDetail);

module.exports = categoryRouter;
