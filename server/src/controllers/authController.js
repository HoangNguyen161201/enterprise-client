const bcrypt = require('bcrypt');
const { createAccessToken, createRefreshToken } = require('../utils/generateToken');

//Import middleware
const catchAsyncError = require('../middlewares/catchAsyncError');

//Import model
const userModel = require('../models/userModel');

const authController = {
  login: catchAsyncError(async (req, res) => {
    //Get email and password login
    const { email, password, role } = req.body;

    //Check exist user
    const user = await userModel.findOne({
      email,
      role
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
    return res.send('get access token');
  }),
};

module.exports = authController;
