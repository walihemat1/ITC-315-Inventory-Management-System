// controllers/userController.js
import User from "../models/userModel.js";

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new passwords are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const userId = req.user._id;
    const currentLoggedInUser = await User.findById(userId);

    if (!currentLoggedInUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const matchedPassword = await currentLoggedInUser.comparePasswords(
      currentPassword
    );

    if (!matchedPassword) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    currentLoggedInUser.password = newPassword;
    await currentLoggedInUser.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log("Error in updatePassword controller: ", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, role } = req.body || {};

    if (!fullName && !email && !role) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    const currentLoggedInUser = await User.findById(req.user._id);
    if (!currentLoggedInUser) {
      return res.status(404).json({
        success: false,
        message: "User not found! Please login again",
      });
    }

    if (!currentLoggedInUser.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is deactivated",
      });
    }

    const updateData = {};

    if (typeof fullName === "string" && fullName.trim() !== "") {
      updateData.fullName = fullName.trim();
    }

    if (typeof email === "string" && email.trim() !== "") {
      updateData.email = email.trim();
    }

    // Only admin can change role (and only if a role is actually passed)
    if (role && role !== currentLoggedInUser.role) {
      if (currentLoggedInUser.role !== "admin") {
        return res.status(401).json({
          success: false,
          message: "Only admin can update the role",
        });
      }

      if (!["admin", "staff"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role value",
        });
      }

      updateData.role = role;
    }

    const updatedUser = await User.findByIdAndUpdate(
      currentLoggedInUser._id,
      updateData,
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log("Error in updateProfile controller: ", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};
