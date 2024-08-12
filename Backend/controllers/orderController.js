const Product = require("../model/product");
const Order = require("../model/order");

// Create an Order
exports.newOrder = async (req, res) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    const order = await Order.create({
        shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice,
        paidAt: Date.now(), user: req.user._id
    })
    res.status(200).json({ order });
}

// Get Single Order
exports.getSingleOrder = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
        return res.status(400).json("Order not found");
    }
    res.status(200).json(order);
}

// Get Logged in Users Orders
exports.myOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
}


// Get All Orders
exports.getAllOrders = async (req, res) => {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });
    res.status(200).json({ orders, totalAmount });
}

// Update Order Status -- Admin
exports.updateOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(400).json("Order not found");
    }
    if (order.orderStatus === 'Delivered') {
        return res.status(400).json("Order is already delivered");
    }
    if (req.body.status === 'Shipped') {
        order.orderItems.forEach(
            async (order) => {
                const product = await Product.findById(order.product);
                product.stock -= order.quantity;
                await product.save({
                    validateBeforeSave: false
                });
            }
        )
    }
    order.orderStatus = req.body.status;
    if (req.body.status === 'Delivered') {
        order.deliveredAt = Date.now();
    }
    await order.save();
    res.status(200).json({
        success: true,
        message: "Order Status Updated"
    });
}

// Delete Orders
exports.deleteOrders = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(400).json("Order not found");
    }
    await order.remove();
    res.status(200).json({
        success: true,
        message : "Order Deleted"});
}