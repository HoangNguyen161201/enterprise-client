const express = require('express');

//Import controller
const departmentController = require('../controllers/departmentController');

//Create department router
const departmentRouter = express.Router();

//Import middleware
const authorization = require('../middlewares/authorization');

departmentRouter.post('/', departmentController.create);

departmentRouter.post('/delete-many', departmentController.deleteMany);

departmentRouter.post(
  '/:id/assign',
  authorization(['admin', 'qa_manager']),
  departmentController.assign
);

departmentRouter.get('/', departmentController.getAll);

departmentRouter.get('/:id', departmentController.getDetail);

departmentRouter.get('/user/:id', departmentController.getDetailByUser);

departmentRouter.put('/:id', authorization(['admin', 'qa_manager']), departmentController.update);

departmentRouter.delete(
  '/:id',
  authorization(['admin', 'qa_manager']),
  departmentController.delete
);

module.exports = departmentRouter;
