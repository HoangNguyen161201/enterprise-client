const bcrypt = require('bcrypt');
const userValid = require('../utils/userValid');

//Import middleware
const catchAsyncError = require('../helpers/catchAsyncError');

//Import model
const userModel = require('../models/userModel');
const departmentModel = require('../models/departmentModel');

const userController = {
  create: catchAsyncError(async (req, res) => {
    //Get info user to create
    const { name, email, password, cf_password, role, avatar } = req.body;

    //Check valid info sign up
    const errMsg = userValid.validSignUp({
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

    //Avatar
    const avatarUser = avatar || {
      public_id: '',
      url: `https://avatars.dicebear.com/api/avataaars/${name}.svg`,
    };

    //Create and save new user
    const NewUser = new userModel({
      name,
      email,
      role,
      password: passwordHash,
      cf_password,
      avatar: avatarUser,
    });

    await NewUser.save();

    return res.status(200).json({
      msg: 'Create User Success!',
      statusCode: 200,
    });
  }),

  update: catchAsyncError(async (req, res) => {
    //get id from query
    const { id } = req.params;

    //get info update
    const { name, email, role } = req.body;

    //check user exist in system
    const user = await userModel.findById(id);

    if (!user)
      return res.status(400).json({
        err: 'The User is does not exist',
        statusCode: 400,
      });

    //check root user
    if (user.root)
      return res.status(400).json({
        err: 'Cannot update user',
        statusCode: 400,
      });

    //valid info update
    const errorValid = userValid.validUpdate({ name, email, role });

    //Check exist error
    if (errorValid)
      return res.status(400).json({
        statusCode: 400,
        err: errorValid,
      });

    //update data by id
    await userModel.findByIdAndUpdate(id, { name, email, role });

    return res.status(200).json({
      statusCode: 200,
      msg: 'Update Success',
    });
  }),

  delete: catchAsyncError(async (req, res) => {
    const { id } = req.params;

    //check user exist in system
    const user = await userModel.findById(id);

    if (!user)
      return res.status(400).json({
        err: 'The User is does not exist',
        statusCode: 400,
      });

    //check root user
    if (user.root)
      return res.status(400).json({
        err: 'Cannot update user',
        statusCode: 400,
      });

    //delete user by id
    await userModel.findByIdAndDelete(id, req.body);

    return res.status(200).json({
      statusCode: 200,
      msg: 'Delete Success',
    });
  }),

  getAll: catchAsyncError(async (req, res) => {
    const users = await userModel.find({}).select('-password');
    return res.status(200).json({
      statusCode: 200,
      msg: 'Get all users success',
      users,
    });
  }),

  getDetail: catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const user = await userModel.findById(id).select('-password');
    if (!user)
      return res.status(400).json({
        err: 'The User is does not exist',
        statusCode: 400,
      });
    return res.status(200).json({
      statusCode: 200,
      msg: 'Get user success',
      user,
    });
  }),

  getRole: catchAsyncError(async (req, res) => {
    const { role } = req.params;

    //Valid role
    const errMsg = userValid.validFilter({ role });

    if (errMsg)
      return res.status(400).json({
        err: errMsg,
        statusCode: 400,
      });

    const users = await userModel.find({ role });

    return res.status(200).json({
      statusCode: 200,
      msg: 'Get user success',
      users: users,
    });
  }),

  getNotDepartment: catchAsyncError(async (req, res) => {
    const staffs = await userModel.find({
      role: 'staff',
      department_id: undefined,
    });

    const QACoordinators = await userModel.find({
      role: 'qa_coordinator',
      department_id: undefined,
    });

    const departmentManagers = await userModel.find({
      role: 'department_manager',
      department_id: undefined,
    });

    return res.status(200).json({
      statusCode: 200,
      msg: 'Get user success',
      staffs,
      QACoordinators,
      departmentManagers,
    });
  }),

  assignDepartment: catchAsyncError(async (req, res) => {
    {
      const { userId, departmentId } = req.body;

      //Check valid data
      const errMsg = userValid.validAssignOneUser({
        userId,
        departmentId,
      });

      if (errMsg)
        return res.status(400).json({
          err: errMsg,
          statusCode: 400,
        });

      //Check exist user
      const user = await userModel.findById(userId);

      if (!user)
        return res.status(400).json({
          err: `User ${userId} not exist in system.`,
          statusCode: 400,
        });

      //Check exist department
      const department = await departmentModel.findById(departmentId);
      if (!department)
        return res.status(400).json({
          err: `Department ${departmentId} not exist in system.`,
          statusCode: 400,
        });

      //Check user assigned other department
      if (user.department_id && user.department_id !== departmentId) {
        return res.status(400).json({
          err: `This user ${userId} has been assigned to another department.`,
          statusCode: 400,
        });
      }

      //Check user assigned this department
      const userCheckAssigned = await userModel.findOne({
        _id: user._id,
        role: user.role,
        department_id: departmentId,
      });
      if (userCheckAssigned) {
        return res.status(400).json({
          err: `There is already a ${user.role} assigned to the department ${departmentId}.`,
          statusCode: 400,
        });
      }

      //Update user department
      user.department_id = department._id;
      await user.save();

      //Update count users of department
      department.count_users = ++department.count_users;
      await department.save();

      return res.status(200).json({
        statusCode: 200,
        msg: 'Assigned success.',
      });
    }
  }),

  manyAssignDepartment: catchAsyncError(async (req, res) => {
    {
      const { users, departmentId } = req.body;

      //Check valid data
      const errMsg = userValid.validAssignManyUsers({
        users,
        departmentId,
      });

      if (errMsg)
        return res.status(400).json({
          err: errMsg,
          statusCode: 400,
        });

      //Number user assign
      let countUsersAssign = 0;

      //Check exist department
      const department = await departmentModel.findById(departmentId);
      if (!department)
        return res.status(400).json({
          err: `Department ${departmentId} not exist in system.`,
          statusCode: 400,
        });

      for (let index = 0; index < users.length; index++) {
        const userId = users[index];

        //Check exist user
        const user = await userModel.findById(userId);

        if (!user)
          return res.status(400).json({
            err: `User ${userId} not exist in system.`,
            statusCode: 400,
          });

        //Check user assigned department
        if (!user.department_id) {
          //Update user department
          user.department_id = department._id;
          await user.save();
          countUsersAssign = ++countUsersAssign;
        }
      }

      //Update count users of department
      department.count_users = department.count_users + countUsersAssign;
      await department.save();

      return res.status(200).json({
        statusCode: 200,
        msg: 'Assigned success.',
      });
    }
  }),

  removeAssignDepartment: catchAsyncError(async (req, res) => {
    {
      const { id: userId } = req.params;

      //Check exist user
      const user = await userModel.findById(userId);
      if (!user)
        return res.status(400).json({
          err: `User ${userId} not exist in system.`,
          statusCode: 400,
        });

      //Remove user out of department
      user.department_id = null;
      await user.save();

      return res.status(200).json({
        statusCode: 200,
        msg: 'Remove user out of department success.',
      });
    }
  }),

  removeManyAssignDepartment: catchAsyncError(async (req, res) => {
    const { users } = req.body;
    //loop remove many user out of department
    for (let index = 0; index < users.length; index++) {
      const userId = users[index];
      // check exist users
      const user = await userModel.findById(userId);
      if (user) {
        //Remove user out of department
        user.department_id = null;
        await user.save();
      }
    }

    return res.status(200).json({
      statusCode: 200,
      msg: 'Remove user out of department success.',
    });
  }),
};
module.exports = userController;
