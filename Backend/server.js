const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./database/DataBase");
const cloudinary = require("cloudinary");

dotenv.config(); 
    
const PORT = process.env.PORT;

connectDB()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
    
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})