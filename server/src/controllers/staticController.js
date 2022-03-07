//import Midlleware
const catchAsyncError = require('../helpers/catchAsyncError');
const moment = require('moment')
//Import model
const ideaModel = require('../models/ideaModel');
const userModel = require('../models/userModel')
const departmentModel = require('../models/departmentModel')

const aggregateOptions = (department_id, options) => {
  return [
    {
      $lookup: {
        from: 'users',
        foreignField: '_id',
        localField: 'user_id',
        as: 'user'
      },
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        department_id: { $toString: '$user.department_id' },
      }
    },
    {
      $match: {
        department_id: department_id
      }
    },
    ...options
  ]
}




const staticController = {
  statusIdeas: catchAsyncError(async (req, res) => {
    //get id department
    const { department_id } = req.query;
    let allIdeas = 0;
    let IdeasNotAccept = 0;
    let IdeasAccept = 0;

    if (department_id) {
      //Get count idea
      const options = aggregateOptions(department_id, [
        {
          $group: {
            _id: {
              department_id: '$user.department_id',
              accept: '$accept',
            },
            count: { $sum: 1 },
          },
        },
      ])
      const newAllIdeas = await ideaModel.aggregate(options);
      if (newAllIdeas && newAllIdeas.length !== 0) {
        newAllIdeas.map((item) => {
          if (item._id && item._id.accept) {
            IdeasAccept = item.count;
          }

          if (item._id && !item._id.accept) {
            IdeasNotAccept = item.count;
          }
        });
      }

      allIdeas = IdeasAccept + IdeasNotAccept;
    } else {
      allIdeas = await ideaModel.count();
      IdeasAccept = await ideaModel
        .find({
          accept: true,
        })
        .count();
      IdeasNotAccept = await ideaModel
        .find({
          accept: false,
        })
        .count();
    }

    return res.status(200).json({
      all: allIdeas,
      accept: IdeasAccept,
      not_accept: IdeasNotAccept,
    });
  }),

  topView: catchAsyncError(async (req, res) => {
    const { department_id, _limit } = req.query;
    const department = await departmentModel.findById(department_id)
    if (!department)
      return res.status(400).json({
        statusCode: 400,
        err: 'this department does not exist in system.',
      });
    const options = aggregateOptions(department_id, [
      {
        $group: {
          _id: {
            user: '$user',
          },
          count: { $sum: '$view' }
        }
      },
      {
        $sort: {
          view: -1
        }
      },
      {
        $limit: Number(_limit) || 5
      }
    ])
  
    const data = await ideaModel.aggregate(options)

    const result = data.map(item => {
      return {
        _id: item._id.user._id,
        avatar: item._id.user.avatar,
        email: item._id.user.email,
        count: item.count
      }
    })
    return res.status(200).json({
      msg: 'Get data success',
      statusCode: 200,
      data: result
    })
  }),

  hasManyIdeas: catchAsyncError(async (req, res) => {
    const { department_id, _limit } = req.query;
    const department = await departmentModel.findById(department_id)
    if (!department)
      return res.status(400).json({
        statusCode: 400,
        err: 'this department does not exist in system.',
      });

    const options = aggregateOptions(department_id, [
      {
        $group: {
          _id: {
            user: '$user'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          count: -1
        }
      },
      {
        $limit: Number(_limit) || 5
      }
    ])

    const data = await ideaModel.aggregate(options)

    const result = data.map(item => {
      return {
        _id: item._id.user._id,
        avatar: item._id.user.avatar,
        email: item._id.user.email,
        count: item.count
      }
    })
    res.status(200).json({
      msg: 'Get data success',
      statusCode: 200,
      data: result
    })
  }),

  countAll: catchAsyncError(async (req, res) => {
    const count_user = await userModel.find({}).count()
    const count_department = await departmentModel.find({}).count()
    const count_idea = await ideaModel.find({}).count()
    return res.status(200).json({
      count_user,
      count_department,
      count_idea,
      msg: 'get all count success',
      statusCode: 200
    })
  }),

  percentIdea: catchAsyncError(async (req, res) => {
    const { department_id } = req.query;
    const department = await departmentModel.findById(department_id)
    if (!department)
      return res.status(400).json({
        statusCode: 400,
        err: 'this department does not exist in system.',
      });

    const count_idea = await ideaModel.count()

    const options = aggregateOptions(department_id, [
      {
        $group: {
          _id: '$department_id',
          count: { $sum: 1 }
        },
      }
    ])

    const data = await ideaModel.aggregate(options)
    const result = data.map(item => {
      return {
        percent: Math.ceil(item.count / count_idea * 100)
      }
    })

    return res.status(200).json({
      data: result,
      msg: 'Get percent success',
      statusCode: 200
    })
  }),

  anonymously: catchAsyncError(async (req, res) => {
    3
    const data = await ideaModel.aggregate([
      {
        $group: {
          _id: '$anonymously',
          count: { $sum: 1 }
        }
      }
    ])

    let value = [0, 0]
    data.map(item => {
      if (item._id) {
        value[0] = item.count
      } else {
        value[1] = item.count
      }
    })

    return res.status(200).json({
      data: value,
      msg: 'Get data success',
      statusCode: 200
    })
  }),

  accept: catchAsyncError(async (req, res) => {
    const data = await ideaModel.aggregate([
      {
        $group: {
          _id: '$accept',
          count: { $sum: 1 }
        }
      }
    ])
    let value = [0, 0]
    data.map(item => {
      if (item._id) {
        value[0] = item.count
      } else {
        value[1] = item.count
      }
    })

    return res.status(200).json({
      data: value,
      msg: 'Get data success',
      statusCode: 200
    })
  }),

  //number of people contributing ideas
  numberOPC: catchAsyncError(async (req, res) => {
    const { department_id } = req.query;
    const department = await departmentModel.findById(department_id)
    if (!department)
      return res.status(400).json({
        statusCode: 400,
        err: 'this department does not exist in system.',
      });

    count_user = await userModel.find({ department_id: department_id }).count()

    const options = aggregateOptions(department_id, [{
      $group: {
        _id: '$user'
      }
    }, {
      $count: 'count'
    }])
    const data = await ideaModel.aggregate(options)

    const result = data[0].count || 0
    return res.status(200).json({
      msg: `${result} out of ${count_user} people contributed ideas`,
      statusCode: 200
    })
  }),

  //get idea by day
  ideaByDate: catchAsyncError(async (req, res) => {
    const { _date, _limit } = req.query
    const allDate = await ideaModel.find({}).sort({ 'createdAt': 1 }).limit(1)
    const time = _date ? _date : allDate[0].createdAt || moment().toISOString()

    const data = await ideaModel.aggregate([
      {
        $lookup: {
          from: 'users',
          foreignField: '_id',
          localField: 'user_id',
          as: 'user'
        },
      },
      {
        $unwind: {
          path: '$user',
        }
      },
      {
        $lookup: {
          from: 'departments',
          foreignField: '_id',
          localField: 'user.department_id',
          as: 'department'
        },
      },
      {
        $match: {
          'createdAt': { $gte: new Date(time) }
        }
      },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      {
        $limit: Number(_limit) || 5
      }
    ])


    const _ids = data.map(item => item._id[0]._id)
    const names = data.map(item => item._id[0].name)
    const descriptions = data.map(item => item._id[0].description)
    const count = data.map(item => item.count)
    return res.status(200).json({
      data: {
        _ids,
        names,
        descriptions,
        count
      },
      msg: 'get data success',
      statusCode: 200,
      dateFirst: allDate[0].createdAt
    })
  }),

  //get idea by day
  getCountIdeaByYear: catchAsyncError(async (req, res) => {
    const { _year, department_id } = req.query
    let countByM = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    const department = await departmentModel.findById(department_id)
    if (!department)
      return res.status(400).json({
        statusCode: 400,
        err: 'this department does not exist in system.',
      });

    count_user = await userModel.find({ department_id: department_id }).count()

    const data = await ideaModel.aggregate([
      {
        $lookup: {
          from: 'users',
          foreignField: '_id',
          localField: 'user_id',
          as: 'user'
        },
      },
      {
        $unwind: {
          path: '$user',
        }
      },
      {
        $lookup: {
          from: 'departments',
          foreignField: '_id',
          localField: 'user.department_id',
          as: 'department'
        },
      },
      {
        $addFields: {
          department_id: { $toString: '$user.department_id' },
          year_idea: { $dateToString: { format: "%Y", date: "$createdAt" } },
        }
      },
      {
        $match: {
          department_id: department_id,
          'year_idea': String(_year || new Date().getFullYear())
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
    ])

    data.map(item => {
      countByM[Number(item._id) - 1] = item.count
    })



    return res.status(200).json({
      data: countByM,
      msg: 'get data success',
      statusCode: 200,
    })
  }),

  //get idea by day
  submissions: catchAsyncError(async (req, res) => {
    const data = await ideaModel.aggregate([
      {
        $lookup: {
          from: 'submissions',
          foreignField: '_id',
          localField: 'submission_id',
          as: 'submission'
        },
      },
      {
        $unwind: {
          path: '$submission',
        }
      },

      {
        $group: {
          _id: '$submission',
          count: { $sum: 1 }
        }
      },
      {
        $sort: {'count': -1}
      },
      {
        $limit: 5
      }
    ])

    const result = data.map(item => ({
      _id: item._id._id,
      avatar: {
        url: item._id.background
      },
      name: item._id.name,
      count: item.count
    }))

    return res.status(200).json({
      data: result,
      msg: 'get data success',
      statusCode: 200,
    })
  })

};


module.exports = staticController;
