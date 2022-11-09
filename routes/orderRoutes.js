const express = require('express');
const { getOrders, newOrders, getOrderDetails, updateOrderPaid, updateOrderDelivery, getAdminOrders, getOrderAnalysis } = require('../controllers/orderController');
const { verifyIsLoggedIn, verifyIsAdmin } = require('../middleware/verifyTokenAuth');

const router = express.Router();

router.use(verifyIsLoggedIn)
router.get("/userOrders", getOrders)
router.post("/", newOrders)
router.get("/order/:id", getOrderDetails)

router.patch("/orderPaid/:id", updateOrderPaid)
router.patch("/orderDelivered/:id", updateOrderDelivery)

router.use(verifyIsAdmin);
router.get("/admin", getAdminOrders)
router.get("/analysis/:date", getOrderAnalysis)

module.exports = router