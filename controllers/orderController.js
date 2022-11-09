const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");


const getOrders = async (req, res, next) => {
    try {
        // console.log(req.user);
        const orders = await Order.find({ user: req.user._id })
        res.status(200).json({
            orders
        })

    } catch (error) {
        next(error);
    }
}

const getOrderDetails = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "-password -isAdmin -createdAt -updatedAt -_id -__v")
        res.status(200).json({
            order
        })
    } catch (error) {
        next(error);
    }
}
const getAdminOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({})
        res.status(200).json({
            orders
        })
    } catch (error) {
        next(error)
    }
}
const newOrders = async (req, res, next) => {
    try {
        const { cartItems, orderTotal, paymentMethod } = req.body;
        if (!(cartItems && orderTotal && paymentMethod)) {
            return res.status(400).send("All fields are required")
        }

        let ids = cartItems.map((item) => {
            return item.productID
        })
        // console.log(ids);
        let qty = cartItems.map((item) => {
            return Number(item.quantity)
        })
        // console.log(qty);


        const product = await Product.find({ _id: { $in: ids } })
        // console.log(product);
        product.forEach((item, idx) => {
            item.sales += qty[idx];
            item.save();
        })
        console.log(product);

        const order = await Order.create({
            cartItems,
            orderTotal,
            paymentMethod,
            user: req.user._id
        })

        res.status(201).send("Order created successfully")

    } catch (error) {
        next(error)
    }
}

const updateOrderPaid = async (req, res, next) => {
    try {

        const order = await Order.findById(req.params.id)
        order.isPaid = true;
        order.paidAt = Date.now();
        // console.log(order)

        await order.save();
        res.status(200).send("Order paid successfully")
    } catch (error) {
        next(error)
    }
}

const updateOrderDelivery = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        await order.save();
        res.status(200).send("Order delivered successfully")
    } catch (error) {
        next(error)
    }
}

const getOrderAnalysis = async (req, res, next) => {
    try {
        const start = new Date(req.params.date)
        start.setHours(0, 0, 0, 0);
        // console.log(start);

        const end = new Date(req.params.date);
        end.setHours(23, 59, 59, 999);
        // console.log(end)

        const order = await Order.find({
            createdAt: {
                $gte: start,
                $lte: end,
            }
        })
        res.status(200).json({
            order
        })

    } catch (error) {
        next(error)
    }
}

module.exports = { getOrders, newOrders, getOrderDetails, updateOrderPaid, updateOrderDelivery, getAdminOrders, getOrderAnalysis };