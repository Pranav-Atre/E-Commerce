const express = require("express");
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrders } = require("../controllers/orderController");

router.post('/order/new', isAuthenticated, newOrder);
router.get('/order/:id', isAuthenticated, getSingleOrder);
router.get('/orders/me', isAuthenticated, myOrders);
router.get('/admin/orders', isAuthenticated, authorizeRoles("admin"), getAllOrders);
router.put('/admin/order/:id', isAuthenticated, authorizeRoles("admin"), updateOrder).
delete('/admin/order/:id', isAuthenticated, authorizeRoles("admin"), deleteOrders);



module.exports = router;
