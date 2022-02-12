//import middleware
const catchAsyncError = require('../middlewares/catchAsyncError');

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
    console.log(id);

    //Get infor to update department
    const { name, description } = req.body;

    //Check exist department and update
    await departmentModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
      }
    );

    return res.status(200).json({
      msg: 'Update department success.',
      statusCode: 200,
    });
  }),
};

module.exports = departmentController;
