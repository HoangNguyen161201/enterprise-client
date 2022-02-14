const express = require('express');

//Import controller
const departmentController = require('../controllers/departmentController');

//Create department router
const departmentRouter = express.Router();

//Import middleware
const authorization = require('../middlewares/authorization');

departmentRouter.post('/', authorization(['admin', 'qa_manager']), departmentController.create);

departmentRouter.get('/', departmentController.getAll);

departmentRouter.put('/:id', authorization(['admin', 'qa_manager']), departmentController.update);

departmentRouter.delete('/:id',authorization(['admin', 'qa_manager']), departmentController.delete);

departmentRouter.get('/:id', authorization(['admin', 'qa_manager']), departmentController.getDetail);

departmentRouter.post('/:id/assign', authorization(['admin', 'qa_manager']), departmentController.assign);


module.exports = departmentRouter;
