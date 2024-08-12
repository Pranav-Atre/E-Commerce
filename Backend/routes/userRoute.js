const express = require("express");
const { registerUser, loginUser, logoutUser, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/me", isAuthenticated ,getUserDetails);
router.put("/password/change", isAuthenticated , updatePassword);
router.put("/me/change", isAuthenticated , updateProfile);
router.get("/admin/users", isAuthenticated, authorizeRoles("admin"), getAllUsers);
router.get("/admin/user/:id", isAuthenticated, authorizeRoles("admin"), getSingleUser)
.put("/admin/user/:id", isAuthenticated, authorizeRoles("admin"), updateUserRole)
.delete("/admin/user/:id", isAuthenticated, authorizeRoles("admin"), deleteUser);

module.exports = router;

