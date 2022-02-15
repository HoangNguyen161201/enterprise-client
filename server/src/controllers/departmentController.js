//import middleware
const catchAsyncError = require('../helpers/catchAsyncError');

//import model
const departmentModel = require('../models/departmentModel');
const userModel = require('../models/userModel');

//import other
const departmentValid = require('../utils/departmentValid');

//Create department controller
const departmentController = {
  create: catchAsyncError(async (req, res) => {
    //Get infor add department
    const { name, description } = req.body;

    //Valid infor add
    const errorValid = departmentValid.createUpdateValid({
      name,
      description,
    });

    //Check exist erro valid
    if (errorValid)
      return res.status(400).json({
        err: errorValid,
        statusCode: 400,
      });

    //Create department
    const newDepartment = new departmentModel({
      name,
      description,
    });
    await newDepartment.save();

    return res.status(200).json({
      msg: 'Created department success.',
      statusCode: 200,
    });
  }),

  update: catchAsyncError(async (req, res) => {
    //Get id of department update
    const { id } = req.params;

    //Get infor to update department
    const { name, description } = req.body;

    //Check exist department
    const department = await departmentModel.findById(id);
    if (!department)
      return res.status(200).json({
        msg: 'This department does not exist in the system.',
        statusCode: 400,
      });

    //Update
    await departmentModel.findByIdAndUpdate(id, {
      name,
      description,
    });

    return res.status(200).json({
      msg: 'Update department success.',
      statusCode: 200,
    });
  }),

  delete: catchAsyncError(async (req, res) => {
    //Get id of department to delete
    const { id } = req.params;

    //Check exist department
    const department = await departmentModel.findById(id);
    if (!department)
      return res.status(400).json({
        msg: 'This department does not exist in the system.',
        statusCode: 400,
      });

    if (department.root)
      return res.status(400).json({
        msg: 'The root department could not be deleted.',
        statusCode: 400,
      });

    //Check exist department and update
    await departmentModel.findByIdAndDelete(id);

    return res.status(200).json({
      msg: 'Deleted department success.',
      statusCode: 200,
    });
  }),

  deleteMany: catchAsyncError(async (req, res) => {
    const { departments } = req.body;

    for (let index = 0; index < departments.length; index++) {
      //Get id of department to delete
      const departmentId = departments[0]._id[index]

      //Check exist department
      const department = await departmentModel.findById(departmentId);

      if (!department)
        return res.status(400).json({
          msg: `Department ${department.name} does not exist in the system.`,
          statusCode: 400,
        });

      if (department.root)
        return res.status(400).json({
          msg: `The root department ${department.name} could not be deleted.`,
          statusCode: 400,
        });

      //Check exist department and delete
      await departmentModel.findByIdAndDelete(id);
    }

    return res.status(200).json({
      msg: 'Deleted department success.',
      statusCode: 200,
    });
  }),

  getAll: catchAsyncError(async (req, res) => {
    //Get all departments
    const departments = await departmentModel.find({});

    return res.status(200).json({
      msg: 'Get all departments success',
      departments,
      statusCode: 200,
    });
  }),

  getDetail: catchAsyncError(async (req, res) => {
    //Get id for get detail
    const { id } = req.params;

    //Get detail department
    const department = await departmentModel.findById(id);

    //Get QA manager
    const qa_manager = await userModel.findOne({
      role: 'qa_manager',
      department_id: department._id,
    });

    //Get QA coordinator
    const qa_coordinator = await userModel.findOne({
      role: 'qa_coordinator',
      department_id: department._id,
    });

    //Get department manager
    const department_manager = await userModel.findOne({
      role: 'department_manager',
      department_id: department._id,
    });

    //Get staffs
    const staffs = await userModel.find({
      role: 'staff',
      department_id: department._id,
    });

    const departmentRes = {
      name: department.name,
      description: department.description,
      count_users: department.count_users,
      qa_manager,
      qa_coordinator,
      department_manager,
      staffs,
    };

    return res.status(200).json({
      msg: `Get detail department ${id} success`,
      department: departmentRes,
      statusCode: 200,
    });
  }),

  assign: catchAsyncError(async (req, res) => {
    //Get id department for assign
    const { id } = req.params;

    //Get data to assign
    const { staffs: newStaffs, qa_coordinator, department_manager } = req.body;

    ///Get detail department and check exist
    const department = await departmentModel.findById(id);
    const { staffs: oldStaffs } = department;
    if (!department)
      return res.status(400).json({
        msg: 'This department does not exist in the system.',
        statusCode: 400,
      });

    //Assign staffs
    for (let index = 0; index < newStaffs.length; index++) {
      const idStaff = newStaffs[index];
      const user = await userModel.find({
        _id: idStaff,
        role: 'staff',
      });
      //Check role staff
      if (!user) {
        return res.status(400).json({
          msg: `Invalid ${idStaff} staff cannot be assign.`,
          statusCode: 400,
        });
      }

      //Check length old array staff
      if (oldStaffs.length === 0) {
        await departmentModel.findOneAndUpdate({ _id: id }, { $push: { staffs: user._id } });
      } else {
        //Check exist staff
        let checkExistStaff = false;
        for (let index = 0; index < oldStaffs.length; index++) {
          const idStaffOld = oldStaffs[index];
          if (user._id.equals(idStaffOld)) {
            checkExistStaff = true;
            break;
          }
        }
        if (!checkExistStaff) {
          //Add staff
          await departmentModel.findOneAndUpdate({ _id: id }, { $push: { staffs: user._id } });
        }
      }
    }

    //Assign qa_coordinator
    const qaCoordinator = await userModel.findOne({
      _id: qa_coordinator,
      role: 'qa_coordinator',
    });

    console.log(qaCoordinator._id);
    //Check exist qa_coordinator
    if (qaCoordinator) {
      await departmentModel.findByIdAndUpdate(id, {
        qa_coordinator: qaCoordinator._id,
      });
    }

    //Assign qa_coordinator
    const departmentManager = await userModel.findOne({
      _id: department_manager,
      role: 'department_manager',
    });

    //Check exist qa_coordinator
    if (departmentManager) {
      await departmentModel.findByIdAndUpdate(id, {
        department_manager: departmentManager._id,
      });
    }

    return res.status(200).json({
      msg: `Assign success.`,
      statusCode: 200,
    });
  }),
};

module.exports = departmentController;
