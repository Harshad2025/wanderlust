const express = require('express');
const { model } = require('mongoose');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const Listing = require('../models/listing');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');
const{validateReview,isLoggedIn,isReviewOwner} = require('../middelware');

const reviewControllers=require('../controllers/review');
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewControllers.createReview));

router.delete(
    "/:reviewId",
        isLoggedIn,
        isReviewOwner,
    wrapAsync(reviewControllers.deleteReview)
);
module.exports = router;