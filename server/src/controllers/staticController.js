//import Midlleware
const catchAsyncError = require('../helpers/catchAsyncError');

//Import model
const ideaModel = require('../models/ideaModel');

const staticController = {
  statusIdeas: catchAsyncError(async (req, res) => {
    //get id department
    const { department_id } = req.query;
    let allIdeas = 0;
    let IdeasNotAccept = 0;
    let IdeasAccept = 0;

    if (department_id) {
      //Get count idea
      const newAllIdeas = await ideaModel.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            department_id: { $toString: '$user.department_id' },
          },
        },
        {
          $match: {
            department_id: department_id,
          },
        },
        {
          $group: {
            _id: {
              department_id: '$user.department_id',
              accept: '$accept',
            },
            count: { $sum: 1 },
          },
        },
      ]);
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
};

module.exports = staticController;
