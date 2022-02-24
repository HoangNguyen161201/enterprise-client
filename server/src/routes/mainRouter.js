//import routers
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const departmentRouter = require('./departmentRouter');
const submissionRouter = require('./submissionRouter');
const categoryRouter = require('./categoryRouter');
const viewRouter = require('./viewRouter');
const ideaRouter = require('./ideaRoute');

const reactionRouter = require('./reactionRouter');
const reactionTypeRouter = require('./reactionTypeRouter');
const commentRouter = require('./commentRouter');

//Config main router
mainRouter = (app) => {
  app.use('/api/auth', authRouter);

  app.use('/api/users', userRouter);

  app.use('/api/departments', departmentRouter);

  app.use('/api/submissions', submissionRouter);

  app.use('/api/categories', categoryRouter);

  app.use('/api/views', viewRouter);

  app.use('/api/idea', ideaRouter);
  
  app.use('/api/reactions', reactionRouter);

  app.use('/api/reactiontypes', reactionTypeRouter); 

  app.use('/api/comments', commentRouter); 
};

module.exports = mainRouter;
