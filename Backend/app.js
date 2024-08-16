const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config(); 

// Set up CORS to allow requests from your frontend (e.g., Vercel)
const allowedOrigins = ["https://e-commerce-7e2vpvax9-pranavs-projects-71abbee2.vercel.app"]; // Replace with your Vercel frontend URL
app.use(cors({
    origin: allowedOrigins,
    credentials: true // Allows sending cookies from the frontend
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');
const payment = require('./routes/paymentRoute');

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

module.exports = app;
