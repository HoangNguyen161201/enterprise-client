const express = require('express');

//Import controller
const departmentController = require('../controllers/departmentController');

//Create department router
const departmentRouter = express.Router();

//Import middleware
const authorization = require('../middlewares/authorization');

departmentRouter.post('/', departmentController.create);

departmentRouter.get('/', departmentController.getAll);

departmentRouter.put('/:id', authorization(['admin', 'qa_manager']), departmentController.update);

departmentRouter.delete(
  '/:id',
  authorization(['admin', 'qa_manager']),
  departmentController.delete
);

departmentRouter.delete('/deletemany', departmentController.deleteMany);

departmentRouter.get('/:id', departmentController.getDetail);

departmentRouter.post(
  '/:id/assign',
  authorization(['admin', 'qa_manager']),
  departmentController.assign
);

module.exports = departmentRouter;
