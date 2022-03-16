const bcrypt = require('bcrypt');
const userValid = require('../utils/userValid');

//Import middleware
const catchAsyncError = require('../helpers/catchAsyncError');

//Import model
const userModel = require('../models/userModel');
const departmentModel = require('../models/departmentModel');
const mailNotice = require('../utils/mailNotice');
const ideaModel = require('../models/ideaModel');
const reactionModel = require('../models/reactionModel');

const userController = {
  create: catchAsyncError(async (req, res) => {
    //Get info user to create
    const { name, email, password, cf_password, role, avatar, department_id } = req.body;

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
      url: `https://avatars.dicebear.com/api/big-smile/${name}.svg`,
    };

    //Increment user
    const maxQuery = await userModel
      .find({})
      .sort({ employee_id: -1 })
      .limit(1)
      .then((users) => users);

    const employee_id = maxQuery[0] ? (maxQuery[0].employee_id + 1) : 1;

    //Check exist department id
    if (department_id) {
      //check exist department
      const department = await departmentModel.findById(department_id);
      if (!department)
        return res.status(400).json({
          statusCode: 400,
          err: 'Department dose not exist!',
        });

      //if user role not match staff
      if (role !== 'staff') {
        //check  role assigned
        const userAssigned = await userModel.findOne({
          role,
          department_id,
        });
        if (userAssigned) {
          return res.status(400).json({
            statusCode: 400,
            err: `${role} of department ${department.name} already exist!`,
          });
        }
      }

      //Create and save new user
      const NewUser = new userModel({
        employee_id,
        name,
        email,
        role,
        password: passwordHash,
        cf_password,
        avatar: avatarUser,
        department_id,
      });
      await NewUser.save();

      //update count user department
      department.count_users = ++department.count_users;
      await department.save();
    } else {
      //Create and save new user without department_id
      const NewUser = new userModel({
        employee_id,
        name,
        email,
        role,
        password: passwordHash,
        cf_password,
        avatar: avatarUser,
      });
      await NewUser.save();
    }

    return res.status(200).json({
      msg: 'Create User Success!',
      statusCode: 200,
    });
  }),

  CreateMany: catchAsyncError(async (req, res) => {
    const { users } = req.body;
    let usersValided = [];
    let userEmails = [];

    //Check user is array
    if (!users || !Array.isArray(users))
      return res.status(400).json({
        statusCode: 400,
        err: `Pleas enter full field data from CSV!`,
      });

    for (let index = 0; index < users.length; index++) {
      const userItem = users[index];

      //Check valid info sign up
      const errMsg = userValid.validSignUp({
        name: userItem.name,
        email: userItem.email,
        role: userItem.role,
        password: userItem.password,
        cf_password: userItem.password,
      });

      if (errMsg)
        return res.status(400).json({
          err: `Error at index ${userItem.index}. ${errMsg}`,
          statusCode: 400,
        });

      //Check email exist in system
      const user = await userModel.findOne({
        email: userItem.email,
      });
      if (user)
        return res.status(400).json({
          err: `Error at index ${userItem.index}. This email already exists.`,
          statusCode: 400,
        });

      //Hash Password
      const passwordHash = await bcrypt.hash(userItem.password, 12);

      //Avatar
      const avatarUser = {
        public_id: '',
        url: `https://avatars.dicebear.com/api/big-smile/${userItem.name}.svg`,
      };

      const newUser = new userModel({
        name: userItem.name,
        email: userItem.email,
        role: userItem.role,
        password: passwordHash,
        avatar: avatarUser,
      });
      usersValided.push(newUser);
      userEmails.push(userItem.email);
    }

    //Check duplicate email
    for (let index = 0; index < userEmails.length; index++) {
      for (let indexCompare = index + 1; indexCompare < userEmails.length; indexCompare++) {
        if (userEmails[index] == userEmails[indexCompare]) {
          return res.status(400).json({
            err: `Duplicate email, please check data CSV.`,
            statusCode: 400,
          });
        }
      }
    }

    //Add usser
    if (usersValided && Array.isArray(usersValided) && usersValided.length > 0) {
      for (let index = 0; index < usersValided.length; index++) {
        //Save user
        await usersValided[index].save();
      }
    }

    return res.status(200).json({
      msg: 'Add employess by import CSV success.',
      statusCode: 200,
    });
  }),

  update: catchAsyncError(async (req, res) => {
    //get id from query
    const { id } = req.params;

    //get info update
    const { name, email, role, department_id } = req.body;

    //check user exist in system
    const user = await userModel.findOne({
      _id: id,
      deleted: false,
    });

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

    switch (role) {
      case 'staff':
        //Check exist department when have department id update
        if (department_id) {
          const department = await departmentModel.findById(department_id);

          if (!department)
            return res.status(400).json({
              err: 'The Department is does not exist',
              statusCode: 400,
            });

          if (user.department_id) {
            //Check user exist new department
            if (String(user.department_id) == String(department._id)) {
              department.count_users = --department.count_users;
            } else {
              //Update old department user count
              const old_department = await departmentModel.findById(user.department_id);
              if (old_department) {
                old_department.count_users = --old_department.count_users;
                await old_department.save();
              }
            }
          }

          //Update new department user count
          department.count_users = ++department.count_users;
          await department.save();

          //update data by id
          await userModel.findByIdAndUpdate(id, { name, email, role, department_id });
        } else {
          //update data by id
          await userModel.findByIdAndUpdate(id, { name, email, role });
        }
        break;

      default:
        //Check user assigned department
        if (user.department_id) {
          const department = await departmentModel.findById(user.department_id);

          //Update department user count
          if (department) {
            department.count_users = --department.count_users;
            await department.save();
          }
        }

        //update data by id Clear department id when role not match with staff
        await userModel.findByIdAndUpdate(id, { name, email, role, department_id: null });
        break;
    }

    return res.status(200).json({
      statusCode: 200,
      msg: 'Update Success',
    });
  }),

  updateAvatar: catchAsyncError(async (req, res) => {
    const { user_id } = req.params;
    const { avatar } = req.body;

    //check user exist in system
    const user = await userModel.findOne({
      _id: user_id,
      deleted: false,
    });

    if (!user)
      return res.status(400).json({
        err: 'The User is does not exist',
        statusCode: 400,
      });

    //Update avatar
    await userModel.findByIdAndUpdate(user_id, { avatar });

    return res.status(200).json({
      statusCode: 200,
      msg: 'Update Avatar Success.',
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

    //Check user assigned department
    if (user.department_id) {
      const department = await departmentModel.findById(user.department_id);

      //Update department user count
      if (department) {
        department.count_users = --department.count_users;
        await department.save();
      }

      //Remove user out of department
      user.department_id = null;
      await user.save();
    }

    //delete user by id
    userModel.deleteById(id, function (err) {
      if (err)
        return res.status(400).json({
          err: 'Something wrent wrong',
          statusCode: 400,
        });
    });

    return res.status(200).json({
      statusCode: 200,
      msg: 'Delete Success',
    });
  }),

  deleteMany: catchAsyncError(async (req, res) => {
    const { users } = req.body;

    for (let index = 0; index < users.length; index++) {
      const userId = users[index];

      //check user exist in system
      const user = await userModel.findById(userId);

      if (user && !user.root) {
        //Check user assigned department
        if (user.department_id) {
          const department = await departmentModel.findById(user.department_id);

          //Update department user count
          if (department) {
            department.count_users = --department.count_users;
            await department.save();
          }

          //Remove user out of department
          user.department_id = null;
          await user.save();
        }

        //delete user by id
        await userModel.findByIdAndDelete(userId, req.body);
      }
    }

    return res.status(200).json({
      statusCode: 200,
      msg: 'Delete Success',
    });
  }),

  getAll: catchAsyncError(async (req, res) => {
    const users = await userModel.find({ deleted: false }).select('-password');
    return res.status(200).json({
      statusCode: 200,
      msg: 'Get all users success',
      users,
    });
  }),

  getDetail: catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const user = await userModel.findById(id).select('-password').populate('department_id');
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

    const users = await userModel.find({ role, deleted: false }).select('-password');

    return res.status(200).json({
      statusCode: 200,
      msg: 'Get user success',
      users: users,
    });
  }),

  getNotDepartment: catchAsyncError(async (req, res) => {
    const staffs = await userModel
      .find({
        role: 'staff',
        department_id: undefined,
        deleted: false,
      })
      .select('-password');

    const QACoordinators = await userModel
      .find({
        role: 'qa_coordinator',
        department_id: undefined,
        deleted: false,
      })
      .select('-password');

    const departmentManagers = await userModel
      .find({
        role: 'department_manager',
        department_id: undefined,
        deleted: false,
      })
      .select('-password');

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
        deleted: false,
      });
      if (userCheckAssigned) {
        return res.status(400).json({
          err: `There is already a ${user.role} assigned to the department ${departmentId}.`,
          statusCode: 400,
        });
      }

      //Check department have user same role, if have will not update users count of department
      const userSameRoleAssigned = await userModel.findOne({
        role: user.role,
        department_id: departmentId,
      });

      //Update user department
      user.department_id = department._id;
      await user.save();

      //Remove user same role assigned out of department
      if (userSameRoleAssigned) {
        userSameRoleAssigned.department_id = null;
        await userSameRoleAssigned.save();
      } else {
        //Update count users of department
        department.count_users = ++department.count_users;
        await department.save();
      }

      //Send mail
      await mailNotice({
        email: user.email,
        subject: `You have been assigned to the department ${department.name}`,
        text: `You have been assigned to the department ${department.name
          } at ${new Date().toString()}`,
        html: '',
      });

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

        //Send mail
        await mailNotice({
          email: user.email,
          subject: `You have been assigned to the department ${department.name}`,
          text: `You have been assigned to the department ${department.name
            } at ${new Date().toString()}`,
          html: '',
        });
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

  updateContact: catchAsyncError(async (req, res) => {
    const { user_id } = req.params;

    //get info update
    const { social_networks, phone, street, country, city } = req.body;

    //check user exist in system
    const user = await userModel.findOne({
      _id: user_id,
      deleted: false,
    });

    if (!user)
      return res.status(400).json({
        err: 'The User is does not exist',
        statusCode: 400,
      });

    await userModel.findByIdAndUpdate(user_id, { social_networks, phone, street, country, city });

    return res.status(200).json({
      msg: 'Update contact success.',
      statusCode: 200,
    });
  }),

  // static user
  staticUser: catchAsyncError(async (req, res) => {
    const { id } = req.body
    const user = await userModel.findById(id)
    if (!user) return res.status(400).json({
      err: 'The User is does not exist',
      statusCode: 400,
    });
    const countAccepted = await ideaModel.find({ user_id: id, accept: true }).count()
    const countUnaccepted = await ideaModel.find({ user_id: id, accept: false }).count()
    const countAnonymously = await ideaModel.find({ user_id: id, anonymously: true }).count()
    const countNoAnonymously = await ideaModel.find({ user_id: id, anonymously: false }).count()

    let totalView = 0
    const data = await ideaModel.find({ user_id: id })
    data.map(item => {
      totalView += item.view
    })

    const dataInteraction = await reactionModel.aggregate([
      {
        $addFields: { idea_id2: { $toObjectId: '$idea_id' } },
      },
      {
        $lookup: {
          from: 'ideas',
          localField: 'idea_id2',
          foreignField: '_id',
          as: 'idea',
        },
      },
      {
        $unwind: {
          path: '$idea',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {user_id: {$toString: '$idea.user_id'}}
      },
      {
        $match: {
          'user_id': id
        }
      },
      {
        $group: {
          _id: '$user_id',
          count: { $sum: 1 },
        }
      }

    ])
    
    const countInteraction = dataInteraction[0].count

    return res.status(200).json({
      msg: 'get data success.',
      statusCode: 200,
      data: [
        {
          label: 'Total ideas (Accepted)',
          count: countAccepted,
          icon: '🌒'
        },
        {
          label: 'Total ideas (Unaccepted)',
          count: countUnaccepted,
          icon: '🌓'
        },
        {
          label: 'Total ideas (Anonymously)',
          count: countAnonymously,
          icon: '🌔'
        },
        {
          label: 'Total ideas (no Anonymously)',
          count: countNoAnonymously,
          icon: '🌕'
        },
        {
          label: 'Total view',
          count: totalView,
          icon: '🌖'
        },
        {
          label: 'total interaction',
          count: countInteraction,
          icon: '🌗'
        },
      ]
    })

  })
};

module.exports = userController;
