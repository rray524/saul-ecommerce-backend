const express = require('express');
const { getReviews, newReviews } = require('../controllers/reviewController');
const { verifyIsLoggedIn } = require('../middleware/verifyTokenAuth');


const router = express.Router();

router.use(verifyIsLoggedIn)
router.get("/", getReviews)
router.post("/create/:productId", newReviews)

module.exports = router