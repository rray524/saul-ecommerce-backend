const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true,
        default: "lorem  dolor sit amet, consectetur adipiscing elit lorem lorem  dolor sit amet, consectetur adipiscing elit lorem lorem  dolor sit amet, consectetur adipiscing elit lorem lorem  dolor sit amet, consectetur adipiscing elit lorem lorem dolor sit amet, consectetur adipiscing el"
    },
    images: {
        type: String,
        default: "/imgs/book-category.jpg"
    },
    attrs: [{
        key: {
            type: String,
        },
        value: [{
            type: String
        }]
    }]

}, {
    timestamps: true,
})

categorySchema.index({ description: 1 })
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;