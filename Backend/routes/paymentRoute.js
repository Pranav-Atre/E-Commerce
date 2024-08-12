const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const { processPayments, sendSecretApiKey } = require("../controllers/paymentController");
const router = express.Router();

router.post("/payment/process", isAuthenticated, processPayments);
router.get("/stripeapikey", isAuthenticated, sendSecretApiKey);

module.exports = router