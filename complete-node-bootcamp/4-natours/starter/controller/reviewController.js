const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');


exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      reviews
    }
  })
});


exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(
    // review : req.body.review,
    // rating: req.body.rating,
    // user : req.user.id,
    // tour: req.params.id
    req.body
  );
  res.status(201).json({
    status: 'success',
    data: { 
      newReview
    }
  })
});


