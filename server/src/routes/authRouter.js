const express = require('express');

//Import controllers
const authController = require('../controllers/authController');

//Create authRouter
const authRouter = express.Router();

//Handle auth routes
//Handle login API
authRouter.post('/login', authController.login);

//Handle logout API
authRouter.post('/logout', authController.logout);

//Handle get access token API
authRouter.get('/accesstoken', authController.getaccesstoken);

//Handle to recover password
authRouter.post('/smtpResetPass', authController.smtpResetPass);

//Handle to reset password
authRouter.post('/resetPassword', authController.resetPassword);

module.exports = authRouter;
