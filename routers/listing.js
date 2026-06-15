const express = require('express');
const { model } = require('mongoose');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Listing = require('../models/listing');
const {isLoggedIn,isOwner,validateListing} = require('../middelware');    

const listingcontrollers=require('../controllers/listing');
const multer  = require('multer')
const { storage } = require('../cloudconfig');
const upload = multer({ storage });


router.get('/',wrapAsync(listingcontrollers.index));

router.get('/new', isLoggedIn, listingcontrollers.renderNewForm);
//show listing details
router.get('/:id',wrapAsync(listingcontrollers.showListing));
//create a new listing
router.post('/', isLoggedIn, validateListing, upload.single('listing[image]'), wrapAsync(listingcontrollers.createListing));
//edit and update listing
router.get('/:id/edit', isLoggedIn,isOwner,wrapAsync(listingcontrollers.renderEditForm));
//update listing
router.put('/:id', isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingcontrollers.updateListing));
//delete listing
router.delete('/:id', isLoggedIn,isOwner,wrapAsync(listingcontrollers.deleteListing));

module.exports = router;