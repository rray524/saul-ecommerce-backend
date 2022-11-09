const express = require('express');
const { getProducts, newProduct, getProductsID, getBestSeller, adminGetProducts, adminDeleteProducts, adminNewProduct, adminUpdateProduct, adminUpload, adminDeleteProductImage } = require('../controllers/productController');
const { verifyIsLoggedIn, verifyIsAdmin } = require('../middleware/verifyTokenAuth');

const router = express.Router();

// user routes
router.get("/", getProducts)
router.post("/", newProduct)
router.get("/seller", getBestSeller)
router.get("/categories/:categoryName/search/:searchQuery", getProducts)
router.get("/categories/:categoryName", getProducts)
router.get("/search/:searchQuery", getProducts)
router.get("/get-one/:id", getProductsID)

// admin routes
router.use(verifyIsLoggedIn)
router.use(verifyIsAdmin)

router.post("/admin/upload", adminUpload)
router.delete("/admin/image/:imagePath/:productId", adminDeleteProductImage)
router.get("/admin", adminGetProducts)
router.post("/admin", adminNewProduct)
router.delete("/admin/:id", adminDeleteProducts)
router.patch("/admin/:id", adminUpdateProduct)

module.exports = router