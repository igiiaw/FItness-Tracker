const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const validate = require("../middleware/validate");
const { updateProfileSchema } = require("../validators/schemas");

// GET /api/users/profile - get logged-in user profile
router.get("/profile", auth, getProfile);

// PUT /api/users/profile - update logged-in user profile
router.put("/profile", auth, validate(updateProfileSchema), updateProfile);

// GET /api/users - admin only: get all users
router.get("/", auth, roleCheck("admin"), getAllUsers);

// DELETE /api/users/:id - admin only: delete a user
router.delete("/:id", auth, roleCheck("admin"), deleteUser);

module.exports = router;
