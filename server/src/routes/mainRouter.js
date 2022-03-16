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
const staticRouter = require('./staticRouter');
const mailRouter = require('./mailRouter');
const draftRouter = require('./draftRouter');

//Config main router
mainRouter = (app) => {
  app.use('/api/auth', authRouter);

  app.use('/api/users', userRouter);

  app.use('/api/departments', departmentRouter);

  app.use('/api/submissions', submissionRouter);

  app.use('/api/categories', categoryRouter);

  app.use('/api/views', viewRouter);

  app.use('/api/ideas', ideaRouter);

  app.use('/api/reactions', reactionRouter);

  app.use('/api/reaction-types', reactionTypeRouter);

  app.use('/api/comments', commentRouter);

  app.use('/api/statics', staticRouter);

  app.use('/api/mails', mailRouter);

  app.use('/api/drafts', draftRouter);
};

module.exports = mainRouter;
