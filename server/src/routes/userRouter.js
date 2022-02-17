const express = require('express');

//Import controllers
const userController = require('../controllers/userController');

//Create user router
const userRouter = express.Router();

//Import middleware
const authorization = require('../middlewares/authorization');

//Handle user routes
userRouter.post('/', userController.create);

userRouter.post('/assign', userController.assignDepartment);

userRouter.post('/assign-many', userController.manyAssignDepartment);

userRouter.post('/remove-assign-many', userController.removeManyAssignDepartment);

userRouter.put('/:id', authorization(['admin', 'qa_manager']), userController.update);

userRouter.delete('/remove-assign/:id', userController.removeAssignDepartment);

userRouter.delete('/:id',  userController.delete);

userRouter.get('/', userController.getAll);

userRouter.get('/role/:role', userController.getRole);

userRouter.get('/not-department', userController.getNotDepartment);

userRouter.get('/:id', authorization(['admin', 'qa_manager']), userController.getDetail);



module.exports = userRouter;
