const express = require('express');

//Import controller
const departmentController = require('../controllers/departmentController');

//Create department router
const departmentRouter = express.Router();

departmentRouter.post('/', departmentController.create);

departmentRouter.put('/:id', departmentController.update);

departmentRouter.delete('/:id', departmentController.delete);

departmentRouter.get('/:id', departmentController.getDetail);

departmentRouter.get('/', departmentController.getAll);

module.exports = departmentRouter;
