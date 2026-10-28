const express = require('express')

const authController = require('../controller/authController');
const reviewController = require('../controller/reviewController');

const router = express.Router({ mergeParams: true });



router.route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  )


router.get('/',);
router.post('/:id', authController.protect, reviewController.createReview);


module.exports = router;
