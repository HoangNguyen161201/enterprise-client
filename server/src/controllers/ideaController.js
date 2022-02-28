const ideaValid = require('../utils/ideaValid');

//import middleware
const catchAsyncError = require('../helpers/catchAsyncError');

//Import Model
const ideaModel = require('../models/ideaModel');
const Filter = require('../utils/filter');
const userModel = require('../models/userModel');
const submissionModel = require('../models/submissionModel');
const reactionModel = require('../models/reactionModel');
const categoryModel = require('../models/categoryModel');
const pageIndex = require('../utils/PageIndex');
const { default: mongoose, mongo } = require('mongoose');

const ideaController = {
  create: catchAsyncError(async (req, res) => {
    //get info idea to create
    const {
      title,
      description,
      content,
      user_id,
      category_id,
      submission_id,
      anonymously,
      files,
      cloudinary_id,
    } = req.body;

    //check valid info input
    const errMsg = ideaValid.ideaFillIn({
      title,
      description,
      content,
      user_id,
      category_id,
      submission_id,
    });

    if (errMsg)
      return res.status(400).json({
        err: errMsg,
        statusCode: 400,
      });

    //Check exist user
    const user = await userModel.findById(user_id);
    if (!user)
      return res.status(400).json({
        err: 'User does not exist in system.',
        statusCode: 400,
      });

    //Check exist category
    if (category_id) {
      const category = await categoryModel.findById(category_id);
      if (!category)
        return res.status(400).json({
          err: 'Category does not exist in system.',
          statusCode: 400,
        });
    }

    //Check exist submission
    const submission = await submissionModel.findById(submission_id);
    if (!submission)
      return res.status(400).json({
        err: 'Submission does not exist in system.',
        statusCode: 400,
      });

    //Check time closure date
    const checkTimeClosure = new Date(submission.closure_date) > new Date();
    if (!checkTimeClosure)
      return res.status(400).json({
        err: 'The closure timeout date has expired.',
        statusCode: 400,
      });

    const NewIdea = new ideaModel({
      title,
      description,
      content,
      user_id,
      category_id: category_id ? category_id : null,
      submission_id,
      anonymously,
      files,
      cloudinary_id,
    });
    await NewIdea.save();

    return res.status(200).json({
      msg: 'Create idea success!',
      statusCode: 200,
    });
  }),

  update: catchAsyncError(async (req, res) => {
    //get id from query
    const { id } = req.params;

    //get info update
    const { title, description, content, category_id, anonymously, files, cloudinary_id } =
      req.body;

    //check idea exist in system
    const idea = await ideaModel.findById(id);

    if (!idea) {
      return res.status(400).json({
        err: 'The Idea does not exist',
        statusCode: 400,
      });
    }

    //Get submission to check time
    if (idea.submission_id) {
      const submission = await submissionModel.findById(idea.submission_id);

      //Check time closure date
      const checkTimeClosure = new Date(submission.closure_date) > new Date();
      if (!checkTimeClosure)
        return res.status(400).json({
          err: 'The closure timeout date has expired, you can not update idea.',
          statusCode: 400,
        });
    }

    if (category_id) {
      //check category exist in system
      const category = await categoryModel.findById(category_id);

      if (!category) {
        return res.status(400).json({
          err: 'The category does not exist',
          statusCode: 400,
        });
      }
    }

    //Check valid data
    const ideaErr = ideaValid.ideaUpdate({
      title,
      description,
      content,
    });

    if (ideaErr)
      return res.status(400).json({
        statusCode: 400,
        err: ideaErr,
      });

    //Update and response
    await ideaModel.findByIdAndUpdate(id, {
      title,
      description,
      content,
      category_id: category_id ? category_id : null,
      anonymously,
      files,
      cloudinary_id: cloudinary_id ? cloudinary_id : null,
    });

    return res.status(200).json({
      statusCode: 200,
      msg: 'Update Success',
    });
  }),

  delete: catchAsyncError(async (req, res) => {
    const { id } = req.params;

    //check idea exist in system
    const idea = await ideaModel.findById(id);

    if (!idea)
      return res.status(400).json({
        err: 'The idea does not exist',
        statusCode: 400,
      });
    await ideaModel.findByIdAndDelete(id, req.body);

    return res.status(200).json({
      statusCode: 200,
      msg: 'Delete Success',
    });
  }),

  getByReaction: catchAsyncError(async (req, res) => {}),

  getAll: catchAsyncError(async (req, res) => {
    const {
      _sort,
      _sortBy,
      _limit,
      _page,
      _nameById,
      _valueById,
      _interactive,
      _reaction,
      _search,
    } = req.query;

    if (_interactive || _reaction) {
      const match = () => {
        if (_reaction) {
          return {
            $match: {
              reactionType_id: _reaction,
<<<<<<< HEAD
              'idea.accept': true
            }
          }
=======
              'idea.accept': true,
            },
          };
>>>>>>> 89ebf0bf24ec0721e3ad9b9c5d1ef191aa9f7d48
        }

        return {
          $match: {
            reactionType_id: { $nin: [''] },
<<<<<<< HEAD
            'idea.accept': true
          }
        }
      }
=======
            'idea.accept': true,
          },
        };
      };
>>>>>>> 89ebf0bf24ec0721e3ad9b9c5d1ef191aa9f7d48
      const page = await reactionModel.aggregate([
        match(),
        {
          $group: {
            _id: '$idea_id',
          },
        },
        {
          $count: 'totalPage',
        },
      ]);

      const result = await reactionModel.aggregate([
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
          $lookup: {
            from: 'users',
            localField: 'idea.user_id',
            foreignField: '_id',
            as: 'idea.user',
          },
        },
        match(),
        {
          $group: {
            _id: '$idea',
            totalReaction: { $sum: 1 },
          },
        },
        {
          $sort: {
            totalReaction: -1,
          },
        },
        {
          $skip: Number(_page - 1) * Number(_limit),
        },
        {
          $limit: Number(_limit),
        },
      ]);

      const data = result.map((item) => {
        return {
          ...item._id,
          totalReaction: item.totalReaction,
          user_id: item._id.user[0],
        };
      });

      return res.status(200).json({
        statusCode: 200,
        msg: 'Get All Success',
        ideas: data,
        page_Index: page.length == 0 ? 0 : Math.ceil(page[0].totalPage / Number(_limit)),
      });
    }
    const page_Index = await pageIndex({ query: ideaModel.find({}), limit: _limit });

    let filter = new Filter(ideaModel);
    filter = filter.getAll({
      accept: true,
    });
    if (_nameById) {
      filter = filter.searchById({ name: _nameById, value: _valueById });
    }
    if (_search) {
<<<<<<< HEAD
      filter = filter.search({ name: 'title', query: _search })
=======
      filter = filter.search({ name: 'title', query: _search });
>>>>>>> 89ebf0bf24ec0721e3ad9b9c5d1ef191aa9f7d48
    }
    if (_sort) {
      filter = filter.sort({ name: _sortBy, NorO: _sort });
    }
    if (_page && _limit) {
      filter = filter.pagination({ page: _page - 1, limit: _limit });
    }

    const data = await filter.query.populate('user_id');
    return res.status(200).json({
      statusCode: 200,
      msg: 'Get All Success',
      ideas: data,
      page_Index,
    });
  }),

  getDetail: catchAsyncError(async (req, res) => {
    const { id } = req.params;

    const idea = await ideaModel
      .findById(id)
      .populate('user_id')
      .populate('category_id')
      .populate('submission_id');

    if (!idea)
      return res.status(400).json({
        err: 'The Idea does not exist',
        statusCode: 400,
      });

    console.log(id);
    const countReactions = await reactionModel.aggregate([
      {
        $match: {
          idea_id: id,
        },
      },
      {
        $group: {
          _id: '$reactionType_id',
          count: { $sum: 1 },
        },
      },
    ]);
    console.log(countReaction);
    return res.status(200).json({
      statusCode: 200,
      msg: ' Get topic success',
      idea,
      countReactions,
    });
  }),

  deleteFile: catchAsyncError(async (req, res) => {
    const { public_id, id } = req.body;
    await ideaModel.findByIdAndUpdate(id, { $pull: { files: { public_id } } });
    return res.status(200).json({
      statusCode: 200,
      msg: 'Delete file success',
    });
  }),
  getIdeaOfUser: catchAsyncError(async (req, res) => {
    const { user_id } = req.params;
    const { submission_id } = req.query;

    const user = await userModel.findById(user_id);
    console.log(user);

    if (!user)
      return res.status(400).json({
        err: 'The user id dose not exist',
        statusCode: 400,
      });

    const submission = await submissionModel.findById(submission_id);
    if (!submission)
      return res.status(400).json({
        err: 'The submission id dose not exist',
        statusCode: 400,
      });

    const ideas = await ideaModel.find({ submission_id, user_id });
    return res.status(200).json({
      msg: 'Get ideas by user success',
      statusCode: 200,
      ideas,
    });
  }),
};

module.exports = ideaController;
