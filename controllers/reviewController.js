const Product = require("../models/ProductModel");
const Review = require("../models/ReviewModel");

const getReviews = async (req, res, next) => {
    const reviews = await Review.find({})
    res.status(200).json({
        reviews
    })
}

const newReviews = async (req, res, next) => {

    const { comment, rating } = req.body;
    if (!comment || !rating) {
        res.status(400).send("All input fields are required")
    }


    const review = await Review.create({

        comment,
        rating: Number(rating),
        user: {
            _id: req.user._id,
            name: req.user.name
        }
    })

    const product = await Product.findById(req.params.productId).populate('reviews');
    // find the user has already reviewed the product
    const alreadyReviewed = product.reviews.find(r => r.user._id.toString() === req.user._id.toString());
    if (alreadyReviewed) {
        return res.status(400).send("User already reviewed the product");
    }
    // console.log(alreadyReviewed);
    // push review id to product reviews
    product.reviews.push(review._id);


    if (product.reviews.length === 1) {
        product.reviewNumber = 1;
        product.rating = review.rating;
    }

    else {
        let oldRating = product.rating
        // console.log(oldRating)
        oldRating = oldRating + review.rating

        product.reviewNumber = product.reviews.length;
        product.rating = oldRating / product.reviewNumber
    }
    await product.save();

    res.status(201).json({
        product
    })
}



module.exports = { getReviews, newReviews };