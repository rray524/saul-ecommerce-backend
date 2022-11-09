const express = require('express');
const router = express.Router();

const { getCategories, newCategory, deleteCategory, attrSave } = require('../controllers/categoryController');

const { verifyIsLoggedIn, verifyIsAdmin } = require('../middleware/verifyTokenAuth');

router.use(verifyIsLoggedIn)
router.use(verifyIsAdmin)

router.delete("/:category", deleteCategory)
router.post("/attr", attrSave)
router.get("/", getCategories)
router.post("/", newCategory)


module.exports = router
