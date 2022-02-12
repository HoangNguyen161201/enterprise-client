const express = require('express');

//Import controllers
const userController = require('../controllers/userController');

//Create user router
const userRouter = express.Router();

//Handle user routes
userRouter.post('/', userController.create)

userRouter.put('/:id', userController.update)

userRouter.delete('/:id', userController.delete)

 // / get
userRouter.get('/', userController.getAll)
// /:id get                   
userRouter.get('/:id', userController.getDetail)

module.exports = userRouter