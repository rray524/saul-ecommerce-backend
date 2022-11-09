const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    user: {
        name: {
            type: String,
            required: true,
        },
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        }
    }

}, {
    timestamps: true,
})

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;