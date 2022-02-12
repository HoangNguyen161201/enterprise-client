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
          msg: 'You must login first.',
        });

      //Decode token
      const { id } = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
        ignoreExpiration: true,
      });

      //Get user token
      const user = await userModel.findById(id).select('-password');

      //Check role
      const isMatchRole = roles.includes(user.role);

      if (!isMatchRole)
        res.status(401).json({
          status: false,
          msg: 'Not have permission to perform this action.',
        });

      return next();
    } catch (error) {
      res.status(401).json({
        status: false,
        msg: 'Sorry, you must provide a valid token.',
      });
    }
  };
};

module.exports = authHelper;
