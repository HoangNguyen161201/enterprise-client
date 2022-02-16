const express = require('express');

//Import controllers
const userController = require('../controllers/userController');

//Create user router
const userRouter = express.Router(); 

//Import middleware
const authorization = require('../middlewares/authorization')

const authorization = require('../middlewares/authorization');

//Handle user routes
<<<<<<< HEAD
userRouter.post('/',  userController.create);
=======
userRouter.post('/', userController.create);
>>>>>>> ea531ff58acab3c951537aa3679a9eb4b86aec4f

userRouter.put('/:id', authorization(['admin', 'qa_manager']), userController.update);

userRouter.delete('/:id', authorization(['admin', 'qa_manager']), userController.delete);

userRouter.get('/', userController.getAll);

userRouter.get('/role/:role', userController.getRole);

userRouter.get('/not-department', userController.getNotDepartment);

userRouter.get('/:id', authorization(['admin', 'qa_manager']), userController.getDetail);

userRouter.post('/assign', userController.assignDepartment);

userRouter.post('/assign-many', userController.manyAssignDepartment);

userRouter.post('/remove-assign', userController.removeAssignDepartment);


module.exports = userRouter;
