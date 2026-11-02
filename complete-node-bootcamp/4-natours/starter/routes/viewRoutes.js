const express = require('express');

const viewsController = require('../controller/viewsController');
const authController = require('../controller/authController');



const router = express.Router();


router.get('/overview', viewsController.getOverview);
router.get('/tour/:slug', authController.protect, viewsController.getTour);
router.get('/login', viewsController.getLoginForm);


module.exports = router;