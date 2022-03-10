const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  createAccessToken,
  createRefreshToken,
  createActiveToken,
} = require('../utils/generateToken');

// sendMail
const mailNotion = require('../utils/mailNotice')

//Import middleware
const catchAsyncError = require('../helpers/catchAsyncError');

//Import model
const userModel = require('../models/userModel');
const { validatePassword } = require('../utils/userValid');

const authController = {
  login: catchAsyncError(async (req, res) => {
    //Get email and password login
    const { email, password, role } = req.body;
    console.log(email, password, role);

    //Check exist user
    const user = await userModel.findOne({
      email,
      role,
      deleted: false,
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
    const user = await userModel
      .findOne({
        _id: result.id,
        deleted: false,
      })
      .select('-password');
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
      user,
      statusCode: 200,
    });
  }),

  smtpResetPass: catchAsyncError(async (req, res) => {
    const { email } = req.body;
    const user = await userModel
      .findOne({
        email,
        deleted: false
      })
      .select('-password');
    if (!user)
      return res.status(401).json({
        err: 'Email not exists',
        statusCode: 401,
      });

    const active_token = await createActiveToken({
      id: user._id,
    });

    const url = `${process.env.URL_CLIENT}/reset-password/${active_token.token}`;

    await mailNotion({
      email,
      html: `<div style='position: relative'></div><div style='padding: 30px; border: 3px solid #07456F; border-radius: 10px; max-width: 400px; position: absolute; top: 50%; left: 50% ; margin: auto'><h1 style='padding-bottom: 30px; color: black'>Resset password:</h1><a href='${url}' style='text-decoration: none ; cursor: pointer; text-align: center;background: #009F9D; padding: 15px; color: white; cursor: pointer; font-size: 16px; border-radius: 5px;  margin-left: 28%'>Reset your password</a><p style='margin-top: 45px; color: black'>If this button can not active, you can click link below:</p><a href='${url}'>${url}</a></div>`,
      subject: "Reset your password",
      text: "click active token to reset password"
    })
   
    return res.status(200).json({
      status: 'success',
      msg: 'Check your email to reset password',
      statusCode: 200,
    });
  }),

  // reset password
  resetPassword: catchAsyncError(async (req, res) => {
    const { activeToken, password, passwordConfirm } = req.body;
    if (!validatePassword(password))
      return res.status(400).json({
        err: 'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
        statusCode: 400,
      });

    if (password != passwordConfirm) 
        return res.status(400).json({
          err: 'Password not match',
          statusCode: 400,
        });

    const passwordHash = await bcrypt.hash(password, 12);

    const data = await jwt.verify(activeToken, process.env.ACTIVE_TOKEN_SECRET, {
      ignoreExpiration: true,
    });

    if (new Date() >= new Date(data.exp * 1000))
      return res.status(400).json({
        err: 'Some thing went wrong! Please request mail reset password again at login page',
        statusCode: 400,
      });

    // find user by id and update
    const user = await userModel.findOne({
      _id: data.id,
      deleted: false
    });
    
    if (!user)
      return res.status(400).json({
        err: 'User not exist',
        statusCode: 400,
      });

    await userModel.findByIdAndUpdate(data.id, {
      password: passwordHash,
    });

    return res.status(200).json({
      msg: 'Reset password successfully',
      statusCode: 200,
    });
  }),
};

module.exports = authController;
