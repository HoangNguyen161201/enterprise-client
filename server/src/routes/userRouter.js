const express = require('express');

//Import controllers
const userController = require('../controllers/userController');

//Create user router
const userRouter = express.Router();

//Import middleware
const authorization = require('../middlewares/authorization')

//Handle user routes
userRouter.post('/', authorization(['admin', 'qa_manager']), userController.create);

userRouter.put('/:id', authorization(['admin', 'qa_manager']), userController.update);

userRouter.delete('/:id', authorization(['admin', 'qa_manager']), userController.delete);

userRouter.get('/', authorization(['admin', 'qa_manager']), userController.getAll);

userRouter.get('/role/:role', authorization(['admin', 'qa_manager']), userController.getRole);

userRouter.get('/:id', authorization(['admin', 'qa_manager']), userController.getDetail);

module.exports = userRouter;
