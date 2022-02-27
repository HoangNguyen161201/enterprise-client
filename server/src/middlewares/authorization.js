const jwt = require('jsonwebtoken');

//Import models
const userModel = require('../models/userModel');

const authHelper = (roles) => {
  return async (req, res, next) => {
    try {
      //Check exist token
      let token = req.headers.authorization;

      if (!token)
        return res.status(401).json({
          status: false,
          statusCode: 401,
          err: 'You must login first.',
        });

      //Decode token
      const { id, exp } = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
        ignoreExpiration: true,
      });

      //Check time token
      var timeLiveToken = new Date(exp * 1000);
      var dateNow = new Date();
      if (timeLiveToken < dateNow)
        return res.status(401).json({
          status: false,
          statusCode: 401,
          err: 'You must login first.',
        });

      //Get user token
      const user = await userModel.findById(id).select('-password');
      console.log(user);

      //Check public
      if (!roles || roles.length === 0) return next();

      //Check role
      const isMatchRole = roles.includes(user.role);

      if (!isMatchRole)
        return res.status(401).json({
          status: false,
          statusCode: 401,
          err: 'Not have permission to perform this action.',
        });

      return next();
    } catch (error) {
      res.status(401).json({
        status: false,
        statusCode: 401,
        err: 'Sorry, you must provide a valid token.',
      });
    }
  };
};

module.exports = authHelper;
