//import routers
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const departmentRouter = require('./departmentRouter');

//Config main router
mainRouter = (app) => {
  app.use('/api/auth', authRouter);

  app.use('/api/users', userRouter);

  app.use('/api/departments', departmentRouter);
};

module.exports = mainRouter;
