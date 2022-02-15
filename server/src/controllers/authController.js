const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createAccessToken, createRefreshToken, createActiveToken } = require('../utils/generateToken');

//Import middleware
const catchAsyncError = require('../helpers/catchAsyncError');

//Import model
const userModel = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');
const { validatePassword } = require('../utils/userValid');

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

  smtpResetPass: catchAsyncError(async (req, res) => {
    const { email } = req.body
    const user = await userModel.findOne({
      email
    }).select('-password')
    if (!user) return res.status(401).json({
      err: 'Email not exists',
      statusCode: 401,
    });

    const active_token = await createActiveToken({
      id: user._id,
    });

    const url = `${process.env.URL_CLIENT}/reset-password/${active_token.token}`

    await sendEmail({ email, url })
    return res.status(200).json({
      status: 'success',
      msg: 'Check your email to reset password',
      statusCode: 200,
    })
  }),

  // reset password
  resetPassword: catchAsyncError(async (req, res) => {
    console.log('fgdfgdfgdfg')
    const { activeToken, password, confirmPassword } = req.body
    console.log(activeToken)
    if (!validatePassword(password)) return res.status(400).json({
      err: 'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
      statusCode: 400,
    });

    if (password != confirmPassword) return res.status(400).json({
      err: 'Password not match',
      statusCode: 400,
    });

    const passwordHash = await bcrypt.hash(password, 12);

    const data = await jwt.verify(activeToken, process.env.ACTIVE_TOKEN_SECRET, {
      ignoreExpiration: true,
    })

    if (new Date() >= new Date(data.exp * 1000)) return res.status(400).json({
      err: 'Some thing went wrong! Please request mail reset password again at login page',
      statusCode: 400,
    });

    // find user by id and update
    const user = await userModel.findById(data.id)
    console.log(user)
    if (!user) return res.status(400).json({
      err: 'User not exist',
      statusCode: 400,
    });

    await userModel.findByIdAndUpdate(data.id, {
      password: passwordHash
    })

    return res.status(200).json({
      msg: 'Reset password successfully',
      statusCode: 200,
    })
  })
};

module.exports = authController;
