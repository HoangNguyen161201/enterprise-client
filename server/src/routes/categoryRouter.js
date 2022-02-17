const express = require('express');

//import controller
const categoryController = require('../controllers/categoryController');

//create categoryRouter
const categoryRouter = express.Router();

//handle category routes
categoryRouter.post('/', categoryController.create);

categoryRouter.put('/:id', categoryController.update);

categoryRouter.delete('/:id', categoryController.delete);

categoryRouter.get('/', categoryController.getAll);

categoryRouter.get('/:id', categoryController.getDetail);

module.exports = categoryRouter;
