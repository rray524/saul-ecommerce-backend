const mongoose = require('mongoose');
const Review = require('./ReviewModel');
const imageSchema = mongoose.Schema({
    path: { type: String, required: true }
})

const productSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
        default: "lorem100  dolor sit   amet, consectetur adipiscing elit   lorem100 lorem100   dolor   sit amet, consectetur adipiscing elit   lorem   100 lorem100 dolor sit amet, consectetur adipiscing elit lorem 100 lorem100 dolor sit amet"
    },
    price: {
        type: Number,
        required: true,
        default: 100
    },
    stock: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
    },
    reviewNumber: {
        type: Number,
    },
    sales: {
        type: Number,
        default: 0,
    },
    attrs: [
        {
            key: {
                type: String,

            },
            value: {
                type: String,

            }
        },

    ],
    images: [imageSchema],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: Review
        }
    ],
},
    {
        timestamps: true
    });

const Product = mongoose.model('Product', productSchema);
// search from product 
productSchema.index({ name: "text", description: "text" }, { name: "TextIndex" });
// show result from ASC & DESC
productSchema.index({ "attrs.key": 1, "attrs.value": 1 });
module.exports = Product;