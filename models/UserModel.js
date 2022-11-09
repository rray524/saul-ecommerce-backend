const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        // required: true
    },
    address: {
        type: String,
        // required: true
    },
    country: {
        type: String,
        // required: true
    },
    zipCode: {
        type: Number,
        // required: true
    },
    city: {
        type: String,
        // required: true
    },
    state: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
})

const User = mongoose.model("User", userSchema);
module.exports = User;