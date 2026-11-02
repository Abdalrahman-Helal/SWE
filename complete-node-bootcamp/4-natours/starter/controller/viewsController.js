const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appErrors');

exports.getOverview = catchAsync(async (req, res, next) => {

  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template

  // 3) Render that template
  res.status(200).render('overview', {
    title: 'All Tours',
    tours

  });
});


exports.getTour = catchAsync(async (req, res, next) => {
  // 1) get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
      path: 'reviews',
      select: 'review rating user'
    });

  if (!tour) {
    throw new AppError('There is no tour with that name.', 404);
  }

  // 2) Build template


  // 3) Render template using data from step 1)
  res.status(200).render('tour', {
    title: tour.name,
    tour
  });
});



exports.getLoginForm = (req, res,) => {
  res.status(200).render('login', {
    title: 'Login into your a ccount'
  });
}