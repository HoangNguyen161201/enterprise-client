const bcrypt = require('bcrypt');
const validSignUp = require('../utils/valid');

//Import middleware
const catchAsyncError = require('../middlewares/catchAsyncError');

//Import model
const userModel = require('../models/userModel');

const userController = {
  create: catchAsyncError(async (req, res) => {
    //Get infor user to create
    const { name, email, password, cf_password, role } = req.body;

    //Check valid infor sign up
    const errMsg = validSignUp({
      name,
      email,
      role,
      password,
      cf_password,
    });

    if (errMsg)
      return res.status(400).json({
        err: errMsg,
        statusCode: 400,
      });

    //Check email exist in system
    const user = await userModel.findOne({
      email,
    });
    if (user)
      return res.status(400).json({
        err: 'This email already exists.',
        statusCode: 400,
      });

    //Hash Password
    const passwordHash = await bcrypt.hash(password, 12);

    //Create and save new user
    const NewUser = new userModel({
      name,
      email,
      role,
      password: passwordHash,
      cf_password,
    });

    await NewUser.save();

    return res.status(200).json({
      msg: 'Create User Success!',
      statusCode: 200,
    });
  }),
};

module.exports = userController;
