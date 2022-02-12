//import middleware
const catchAsyncError = require('../helpers/catchAsyncError');

//import model
const departmentModel = require('../models/departmentModel');

//import other
const departmentValid = require('../utils/departmentValid');

//Create department controller
const departmentController = {
  create: catchAsyncError(async (req, res) => {
    //Get infor add department
    const { name, description } = req.body;
    console.log(name, description);

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

    //Check exist department and update
    await departmentModel.findByIdAndDelete(id);

    return res.status(200).json({
      msg: 'Deleted department success.',
      statusCode: 200,
    });
  }),

  getAll: catchAsyncError(async (req, res) => {
    //Get all departments
    const departments = await departmentModel.find({});

    res.status(200).json({
      msg: 'Get all departments success',
      departments,
      statusCode: 200,
    });
  }),

  getDetail: catchAsyncError(async (req, res) => {
    //Get id for get detail
    const {id} = req.params;

    //Get detail department
    const department = await departmentModel.findById(id);

    res.status(200).json({
      msg: `Get detail department ${id} success`,
      department,
      statusCode: 200,
    });
  }),
};

module.exports = departmentController;
