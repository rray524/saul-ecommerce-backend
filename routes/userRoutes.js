const express = require('express');
const { getUsers, registerUser, loginUser, updateUserProfile, getUserProfile, updateUser, removeUser } = require('../controllers/userController');
const { verifyIsLoggedIn, verifyIsAdmin } = require('../middleware/verifyTokenAuth');
const { route } = require('./apiRoutes');


const router = express.Router();

router.post("/register", registerUser)
router.post("/login", loginUser)

// user routes
router.use(verifyIsLoggedIn)
router.patch("/profile", updateUserProfile)



// admin routes
router.use(verifyIsAdmin)
router.get("/", getUsers)
router.patch("/:id", updateUser)
router.delete("/:id", removeUser)
router.get("/profile/:id", getUserProfile)

module.exports = router