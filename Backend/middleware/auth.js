const jwt = require("jsonwebtoken");
const User = require("../model/user");

exports.isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ 
            success : false,
            message: "You are not authenticated" });
    }
    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id);
        next();
    } catch (error) {
        res.json({ message: error.message });
    }
}

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.json({ message: "You are not authorized to perform this action" });
        }
        next();
    }
}