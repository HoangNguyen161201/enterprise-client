const express = require('express');

//import controllers
const ideaController = require('../controllers/ideaController');

//Create ideaRouter
const ideaRouter = express.Router();

//Import middleware
const authorization = require('../middlewares/authorization');

//Handle idea routes
ideaRouter.post(
  '/',
  authorization(['qa_manager', 'qa_coordinator', 'department_manager', 'staff']),
  ideaController.create
);

ideaRouter.put(
  '/accept',
  authorization(['qa_manager', 'qa_coordinator', 'department_manager', 'staff']),
  ideaController.setAccept
);

ideaRouter.put(
  '/:id',
  authorization(['qa_manager', 'qa_coordinator', 'department_manager', 'staff']),
  ideaController.update
);

ideaRouter.delete(
  '/:id',
  authorization(['qa_manager', 'qa_coordinator', 'department_manager', 'staff']),
  ideaController.delete
);

ideaRouter.get(
  '/',
  // authorization(['qa_manager', 'qa_coordinator', 'department_manager', 'staff']),
  ideaController.getAll
);

ideaRouter.get(
  '/:id',
  // authorization(['qa_manager', 'qa_coordinator', 'department_manager', 'staff']),
  ideaController.getDetail
);

ideaRouter.get(
  '/user/:user_id',
  authorization(['qa_manager', 'qa_coordinator', 'department_manager', 'staff']),
  ideaController.getIdeaOfUser
);

ideaRouter.get(
  '/accept/:user_id',
  authorization(['qa_manager', 'qa_coordinator', 'department_manager', 'staff']),
  ideaController.getIdeaAcceptOfUser
);

module.exports = ideaRouter;
