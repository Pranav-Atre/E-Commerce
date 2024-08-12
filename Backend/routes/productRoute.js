const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview, getAdminProducts } = require("../controllers/productController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.get('/products', getAllProducts);
router.get('/admin/products', isAuthenticated, authorizeRoles("admin"), getAdminProducts);
router.post('/admin/products/new', isAuthenticated, authorizeRoles("admin"), createProduct);
router.put('/admin/products/:id', isAuthenticated, authorizeRoles("admin"), updateProduct)
.delete('/admin/products/:id', isAuthenticated, authorizeRoles("admin"), deleteProduct);
router.get('/products/:id', getProductDetails);
router.put('/review', isAuthenticated, createProductReview);
router.get("/reviews", getProductReviews).delete("/reviews", isAuthenticated , deleteReview);

module.exports = router;