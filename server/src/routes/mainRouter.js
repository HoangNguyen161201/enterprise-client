//import routers
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const departmentRouter = require('./departmentRouter');
const submissionRouter = require('./submissionRouter');
const categoryRouter = require('./categoryRouter')


//Config main router
mainRouter = (app) => {
  app.use('/api/auth', authRouter);

  app.use('/api/users', userRouter);

  app.use('/api/departments', departmentRouter);

  app.use('/api/submissions', submissionRouter);
  
  app.use('/api/category', categoryRouter)
};

module.exports = mainRouter;
