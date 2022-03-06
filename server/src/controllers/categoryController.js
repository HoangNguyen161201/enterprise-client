const categoryValid = require('../utils/categoryValid');

//Import middleware
const catchAsyncError = require('../helpers/catchAsyncError');

//import model
const categoryModel = require('../models/categoryModel');
const { getDetail } = require('./userController');
const ideaModel = require('../models/ideaModel');

const categoryController = {
  create: catchAsyncError(async (req, res) => {
    //get info category to create
    const { name, description } = req.body;

    //check valid info input
    const errMsg = categoryValid.categoryFillIn({
      name,
      description,
    });

    if (errMsg)
      return res.status(400).json({
        err: errMsg,
        statusCode: 400,
      });

    const NewCategory = new categoryModel({
      name,
      description,
    });
    await NewCategory.save();

    return res.status(200).json({
      msg: 'Create category success!',
      statusCode: 200,
    });
  }),

  createMany: catchAsyncError(async (req, res) => {
    //get info category to create
    const { categories } = req.body;

    let categoriesValided = [];
    let categoriesName = [];

    //Check categories is array
    if (!categories || !Array.isArray(categories))
      return res.status(400).json({
        statusCode: 400,
        err: `Pleas enter full field data from CSV!`,
      });

    for (let index = 0; index < categories.length; index++) {
      const categoryItem = categories[index];
      console.log(categoryItem);

      //check valid info input
      const errMsg = categoryValid.categoryFillIn({
        name: categoryItem.name,
        description: categoryItem.description,
      });

      if (errMsg)
        return res.status(400).json({
          err: `Error at index ${categoryItem.index}. ${errMsg}`,
          statusCode: 400,
        });

      //Check exist category in system
      const categoryExist = await categoryModel.findOne({
        name: categoryItem.name,
      });
      if (categoryExist)
        return res.status(400).json({
          err: `Error at index ${categoryItem.index}. This category existed in system.`,
          statusCode: 400,
        });

      const NewCategory = new categoryModel({
        name: categoryItem.name,
        description: categoryItem.description,
      });

      categoriesValided.push(NewCategory);
      categoriesName.push(categoryItem.name);
    }

    //Check duplicate name categories
    for (let index = 0; index < categoriesName.length; index++) {
      for (let indexCompare = index + 1; indexCompare < categoriesName.length; indexCompare++) {
        if (categoriesName[index] == categoriesName[indexCompare]) {
          return res.status(400).json({
            err: `Duplicate name categories, please check data CSV.`,
            statusCode: 400,
          });
        }
      }
    }

    //Add categories
    if (categoriesValided && Array.isArray(categoriesValided) && categoriesValided.length > 0) {
      for (let index = 0; index < categoriesValided.length; index++) {
        //Save user
        await categoriesValided[index].save();
      }
    }

    return res.status(200).json({
      msg: 'Create categories by import CSV success!',
      statusCode: 200,
    });
  }),

  update: catchAsyncError(async (req, res) => {
    //get id from query
    const { id } = req.params;
    //get info update
    const { name, description } = req.body;
    // check category exist in system
    const category = await categoryModel.findById(id);

    if (!category) {
      return res.status(400).json({
        err: 'The category is does not exist',
        statusCode: 400,
      });
    }
    const categoryErr = categoryValid.categoryFillIn({
      name,
      description,
    });
    if (categoryErr)
      return res.status(400).json({
        statusCode: 400,
        err: categoryErr,
      });
    await categoryModel.findByIdAndUpdate(id, {
      name,
      description,
    });
    return res.status(200).json({
      statusCode: 200,
      msg: 'Update Success',
    });
  }),

  delete: catchAsyncError(async (req, res) => {
    const { id } = req.params;

    //check category exist in system
    const category = await categoryModel.findById(id);

    if (!category)
      return res.status(400).json({
        err: 'The Category is does not exist',
        statusCode: 400,
      });
    const idea = await ideaModel.findOne({
      category_id: id,
    });
    if (idea) {
      return res.status(400).json({
        err: 'Please delete all idea of this category',
        statusCode: 400,
      });
    }
    await categoryModel.findByIdAndDelete(id, req.body);

    return res.status(200).json({
      statusCode: 200,
      msg: 'Delete Success',
    });
  }),

  getAll: catchAsyncError(async (req, res) => {
    const categories = await categoryModel.find({});
    return res.status(200).json({
      statusCode: 200,
      msg: 'Get all topic success',
      categories,
    });
  }),

  getDetail: catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const category = await categoryModel.findById(id);

    if (!category)
      return res.status(400).json({
        err: 'The topic is does not exist',
        statusCode: 400,
      });
    return res.status(200).json({
      statusCode: 200,
      msg: 'Get Category success',
      category,
    });
  }),
};
module.exports = categoryController;
