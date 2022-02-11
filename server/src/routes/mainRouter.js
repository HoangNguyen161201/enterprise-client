//import routers
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');

//Config main router
mainRouter = (app) => {
  app.use('/api/auth', authRouter);

  app.use('/api/users', userRouter);
};

module.exports = mainRouter;
