const express = require('express');

//Import controllers
const userController = require('../controllers/userController');

//Create user router
const userRouter = express.Router();

//Handle user routes
userRouter.post('/', userController.create)

module.exports = userRouter