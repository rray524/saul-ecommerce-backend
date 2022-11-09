const User = require("../models/UserModel");
const generateAuthToken = require("../utils/generateAuthToken");
const { hashPassword, comparePassword } = require("../utils/hashPassword");



const getUsers = async (req, res, next) => {
    try {

        const users = await User.find({}).select("-password")
        res.status(200).json({
            users
        })

    } catch (error) {
        next(error);
    }
}
const getUserProfile = async (req, res, next) => {
    try {

        const user = await User.findById(req.params.id).select("-password")
        res.status(200).json({
            user
        })

    } catch (error) {
        next(error);
    }
}

const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        user.name = req.body.name;
        user.email = req.body.email;
        user.isAdmin = req.body.isAdmin
        await user.save();
        res.status(200).json({
            user
        })
    } catch (error) {
        next(error);
    }
}

const removeUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        await user.remove();
        res.status(200).json({
            message: "User removed successfully"
        })
    } catch (error) {
        next(error)
    }


}

const updateUserProfile = async (req, res, next) => {

    const user = await User.findById(req.user._id);
    // console.log(user);
    user.name = req.body.name || user.name;
    user.email = req.body.email.toLowerCase() || user.email;
    user.phone = req.body.phone;
    user.address = req.body.address;
    user.country = req.body.country;
    user.zipCode = req.body.zipCode;
    user.city = req.body.city;
    user.state = req.body.state;
    if (user.password !== req.body.password) {
        user.password = hashPassword(req.body.password);
    }

    // save to DB
    await user.save();

    res.status(200).json({
        message: "Success",
        name: user.name,
        email: user.email,
    });

}

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!(email && password && name)) {
            res.status(400).send("All fields are required")
        }
        // console.log(name, email, password);
        const existingUser = await User.findOne({ email: email.toLowerCase() });


        if (existingUser) {
            res.status(400).send(`User ${name} already exists`);
        }
        else {
            // hash password function
            const hashedPassword = hashPassword(password);
            // console.log(hashedPassword);
            const users = await User.create({ name, email: email.toLowerCase(), password: hashedPassword });
            res.cookie("access_token", generateAuthToken(users._id, users.name, users.email, users.isAdmin), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict"
            }).status(201).json({
                message: `${users.email} user has been successfully created`
            })
        }

    } catch (error) {
        next(error);

    }
}

const loginUser = async (req, res, next) => {

    try {
        const { email, password, doNotLogOut } = req.body;

        if (!(email && password)) {
            res.status(400).send("All fields are required")
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        // user exist and compare password
        if (user && comparePassword(password, user.password)) {
            let cookieParams = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict"
            }

            if (doNotLogOut) {
                cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24 * 7 }
            }

            res.cookie("access_token", generateAuthToken(user._id, user.name, user.email, user.isAdmin), cookieParams).status(201).json({
                message: `${user.name} has been logged in successfully`
            })
        }
        else {
            res.status(401).send("Wrong credentials")
        }



    } catch (error) {
        next(error);
    }

}


module.exports = { getUsers, registerUser, loginUser, updateUserProfile, getUserProfile, updateUser, removeUser };