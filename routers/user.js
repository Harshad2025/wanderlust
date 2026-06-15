const express = require('express');
const { model } = require('mongoose');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { listingSchema , reviewSchema} = require('../schema');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { isLoggedIn, savedRedirectUrl } = require('../middelware');

const userControllers=require('../controllers/user');

router.get('/signup',userControllers.renderSignUpForm);
router.post('/signup', wrapAsync(userControllers.signUp));

router.get('/login',userControllers.renderLoginForm);

router.post('/login',savedRedirectUrl, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),userControllers.login);
router.get('/logout', userControllers.logout);


module.exports = router;