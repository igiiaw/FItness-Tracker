const User = require("../models/User");

// GET /api/users/profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { username, email, age, weight, height } = req.body;

    if (username) {
      const existing = await User.findOne({
        username,
        _id: { $ne: req.user.id },
      });
      if (existing) {
        return res.status(400).json({ message: "Username already taken." });
      }
    }

    if (email) {
      const existing = await User.findOne({
        email,
        _id: { $ne: req.user.id },
      });
      if (existing) {
        return res.status(400).json({ message: "Email already taken." });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, email, age, weight, height },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Profile updated successfully.", user });
  } catch (error) {
    next(error);
  }
};

// GET /api/users (admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id (admin only)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, getAllUsers, deleteUser };
