//import routers
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const departmentRouter = require('./departmentRouter');
const submissionRouter = require('./submissionRouter');
const categoryRouter = require('./categoryRouter');
const viewRouter = require('./viewRouter');
<<<<<<< HEAD
const ideaRouter = require('./ideaRoute');

=======
const reactionRouter = require('./reactionRouter');
const reactionTypeRouter = require('./reactionTypeRouter');
const commentRouter = require('./commentRouter');
>>>>>>> 070befc47cce51d3c1cf25a93723a8e34a44d811

//Config main router
mainRouter = (app) => {
  app.use('/api/auth', authRouter);

  app.use('/api/users', userRouter);

  app.use('/api/departments', departmentRouter);

  app.use('/api/submissions', submissionRouter);

  app.use('/api/categories', categoryRouter);

  app.use('/api/views', viewRouter);

<<<<<<< HEAD
  app.use('/api/idea', ideaRouter);
=======
  app.use('/api/reactions', reactionRouter);

  app.use('/api/reactiontypes', reactionTypeRouter); 

  app.use('/api/comments', commentRouter); 
>>>>>>> 070befc47cce51d3c1cf25a93723a8e34a44d811
};

module.exports = mainRouter;
