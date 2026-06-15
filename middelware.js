const Listing = require('./models/listing');
const ExpressError = require('./utils/ExpressError');
const { listingSchema, reviewSchema} = require('./schema');
const Review = require('./models/review');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl= req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};
module.exports.savedRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
};
module.exports.isOwner = async (req, res, next) => {
    let {id}=req.params;
    let listing=await Listing.findById(id);
        if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash('error', 'You are not the owner of this listing!');
        return res.redirect(`/listings/${id}`);
        }
        next();
    };
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
     let { error } = reviewSchema.validate(req.body);
   
    if(error){
        throw new ExpressError(400,"Invalid review data");
     }
     else{
        next();
     }
    };

module.exports.isReviewOwner = async (req, res, next) => {
    let {id, reviewId}=req.params;
    let review=await Review.findById(reviewId);
    console.log("Review Author:", review.author);
    console.log("Current User:", res.locals.currentUser._id);
        if(!review.author.equals(res.locals.currentUser._id)){
        req.flash('error', 'You are not the author of this review!');
        return res.redirect(`/listings/${id}`);
        }
        next();
    };