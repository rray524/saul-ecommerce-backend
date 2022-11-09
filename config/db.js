const mongoose = require('mongoose');
const colors = require('colors');

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(colors.green.underline.bold("Mongodb connected successfully"));
    } catch (error) {
        console.error(colors.red.underline.bold("Mongodb connection error"));
        process.exit(1);
    }
}

module.exports = connectDb;