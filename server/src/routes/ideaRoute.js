const express = require('express');

//import controllers
const ideaController = require('../controllers/ideaController');

//Create ideaRouter
const ideaRouter = express.Router();

//Handle idea routes
ideaRouter.post('/', ideaController.create);

ideaRouter.put('/:id', ideaController.update);

ideaRouter.delete('/:id', ideaController.delete);

ideaRouter.get('/', ideaController.getAll);

ideaRouter.get('/:id', ideaController.getDetail);

ideaRouter.get('/user/:user_id', ideaController.getIdeaOfUser);

module.exports = ideaRouter;
