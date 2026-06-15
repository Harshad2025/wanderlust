const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');
const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title: {type: String, required: true},
    description: String,
    price: Number,
    location: String,
     image: {
        filename:String,
        url: String,
    },
        country: String,
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review"
            }
        ],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({
            _id: { $in: listing.reviews },
        });
    }
});
const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;