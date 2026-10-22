const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');


exports.signUp = catchAsync(async (req, res, next) => {
  const newsUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newsUser
    }
  });
});