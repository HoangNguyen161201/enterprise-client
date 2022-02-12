const express = require('express');

//Import controller
const departmentController = require('../controllers/departmentController');

//Create department router
const departmentRouter = express.Router();

//Import middleware
const authorization = require('../middlewares/authorization');

departmentRouter.post('/', authorization(['admin', 'qa_manager']), departmentController.create);

departmentRouter.put('/:id', departmentController.update);

departmentRouter.delete('/:id', departmentController.delete);

departmentRouter.get('/:id', departmentController.getDetail);

departmentRouter.get('/', departmentController.getAll);

module.exports = departmentRouter;
