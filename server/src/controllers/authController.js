const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createAccessToken, createRefreshToken } = require('../utils/generateToken');

//Import middleware
const catchAsyncError = require('../helpers/catchAsyncError');

//Import model
const userModel = require('../models/userModel');

const authController = {
  login: catchAsyncError(async (req, res) => {
    //Get email and password login
    const { email, password, role } = req.body;

    //Check exist user
    const user = await userModel.findOne({
      email,
      role,
    });
    if (!user)
      return res.status(400).json({
        err: 'This email does not exists.',
        statusCode: 400,
      });

    //Check password correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        err: 'Incorrect passwrod.',
        statusCode: 400,
      });

    //Generate access and refresh token
    const access_token = await createAccessToken({
      id: user._id,
    });
    const refresh_token = await createRefreshToken({
      id: user._id,
    });

    return res.status(200).json({
      accessToken: access_token,
      refreshToken: refresh_token,
      status: 'success',
      msg: 'Login success!',
      statusCode: 200,
    });
  }),

  logout: catchAsyncError(async (req, res) => {
    return res.status(200).json({
      status: 'success',
      msg: 'Logout success!',
      statusCode: 200,
    });
  }),

  getaccesstoken: catchAsyncError(async (req, res) => {
    //Check live refresh token
    const rf_token = await req.cookies.refresh_token;
    if (!rf_token)
      return res.status(401).json({
        err: 'Please login now!',
        statusCode: 401,
      });

    //Check refresh verify
    const result = await jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, {
      ignoreExpiration: true,
    });
    if (!result)
      return res.status(401).json({
        err: 'Your token is incorrect or has expired.',
        statusCode: 401,
      });

    //Check time exp of refresh token
    const exp = new Date(result.exp * 1000).toDateString();
    const timeNow = new Date().toDateString();
    if (exp < timeNow)
      return res.status(401).json({
        err: 'Please login now!',
        statusCode: 401,
      });

    //Check user exist in system
    const user = await userModel.findById(result.id).select('-password');
    if (!user)
      return res.status(400).json({
        err: 'User does not exist.',
        statusCode: 400,
      });

    //Create new access token
    const access_token = await createAccessToken({
      id: user._id,
    });

    return res.status(200).json({
      status: 'success',
      accessToken: access_token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        root: user.root,
        avatar: user.avatar,
      },
      statusCode: 200,
    });
  }),
};

module.exports = authController;
