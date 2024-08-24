const User = require("../model/user");
const sendToken = require("../utils/jwtToken");
const cloudinary = require("cloudinary")


exports.registerUser = async (req, res) => {
        // Check if email already exists
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(500).json({error : 'Email already exists'});
        }
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    }
    )
    try {
        const user = await User.create({
            name, email, password,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        });
        sendToken(user, res);
    } catch (error) {
        res.status(500).json({ error });
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.json({ error: "Please enter all the fields" })
        }
        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(401).json({
            success: false,
            message: "Incorrect email or password"
        });
        const isMatched = await user.comparePassword(password);
        if (!isMatched) return res.status(401).json({
            success: false,
            message: "Incorrect email or password"
        });
        sendToken(user, res);
    }
    catch (error) {
        res.json(error.message);
    }
}

exports.logoutUser = async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.json({ success: "Logged out successfully" })
}

// Get user details
exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        res.json(user);
    } catch (error) {
        res.json(error.message);
    }
}

// Update user password
exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("+password");
        const isMatched = await user.comparePassword(req.body.oldPassword);
        if (!isMatched) return res.status(401).json({ 
            success: false,
            message: "Incorrect password" });
        if (req.body.newPassword.length < 8) return res.status(401).json({ 
            success: false,
            message: "Password shouldn't be less than 8 Characters" })
        if (req.body.newPassword !== req.body.confirmPassword) return res.status(401).json({ 
            success: false,
            message: "Password doesn't match" })
        user.password = req.body.newPassword;
        await user.save();
        sendToken(user, res);
    } catch (error) {
        res.json(error.message);
    }
}

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
        };

        // Check if the avatar is provided
        if (req.body.avatar && req.body.avatar !== "") {
            const user = await User.findById(req.user.id);

            // Delete the old avatar if it exists
            if (user.avatar && user.avatar.public_id) {
                const imageId = user.avatar.public_id;
                await cloudinary.v2.uploader.destroy(imageId);
            }

            // Upload the new avatar
            const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: "avatars",
                width: 150,
                crop: "scale",
            });

            newUserData.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        // Update user data
        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


//Get all users(Admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json({users});
    } catch (error) {
        res.json(error.message);
    }
}

//Get Single user (Admin)
exports.getSingleUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.json({ error: "User not found" });
        }
        res.json({user});
    } catch (error) {
        res.json(error.message);
    }
}

// Update user role (Admin)
exports.updateUserRole = async (req, res) => {
    try {
        // Fetch the current user from the database
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if the email is being updated and if it's different from the current one
        if (req.body.email && req.body.email !== user.email) {
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: "This email is already in use by another user.",
                });
            }
        }

        const newUserData = {
            name: req.body.name || user.name,
            email: req.body.email || user.email,
            role: req.body.role || user.role
        };

        // Update user data
        await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify : false
        });

        res.status(200).json({
            success: true,
            message: "User updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Delete user (Admin)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.json({ error: "User not found" });
        };

        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);
        
        await user.remove();
        res.json({
            success: true,
            message: "User Deleted Successfully"
        });
    } catch (error) {
        res.json(error.message);
    }
}
