const express = require('express');
const tourController = require('../controller/tourController');
const authController = require('../controller/authController');
// const reviewController = require('../controller/reviewController');
const reviewRouter = require("./reviewRouts")

const router = express.Router();

// router.param('id', tourController.checkId);

router.use('/:tourId/reviews', reviewRouter);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours)

router
  .route('/tour-stats')
  .get( tourController.getTourStats)

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'), 
    tourController.getMonthlyPlan
  )

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getTourWithin)
// /tour-within?distance=233,center=-40,45&unit 
// /tour-within/233/center/-40,45/unit/mi


router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect, 
    authController.restrictTo('admin','lead-guide'), 
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour,
  )
  .delete(
    authController.protect, 
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour);





module.exports = router;
