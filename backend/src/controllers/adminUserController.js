import User from "../models/userModel.js";

/**
 * Admin creates a staff user
 * POST /api/admin/users
 */
export const createStaff = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Required fields missing" });

    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });

    // force default role to staff if not admin
    const assignedRole = role === "admin" ? "admin" : "staff";

    const created = await User.create({
      fullName,
      email,
      password,
      role: assignedRole,
    });

    const userSafe = {
      _id: created._id,
      fullName: created.fullName,
      email: created.email,
      role: created.role,
      isActive: created.isActive,
    };

    res
      .status(201)
      .json({ success: true, message: "Staff user created", data: userSafe });
  } catch (error) {
    console.error("createStaff error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get list of users (admin)
 * GET /api/admin/users
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("getUsers error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Update role
 * PATCH /api/admin/users/:id/role
 * body: { role: "admin" | "staff" }
 */
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!["admin", "staff"].includes(role))
      return res.status(400).json({ success: false, message: "Invalid role" });

    const updated = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res
      .status(200)
      .json({ success: true, message: "Role updated", data: updated });
  } catch (error) {
    console.error("updateUserRole error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Activate / Deactivate user
 * PATCH /api/admin/users/:id/status
 * body: { isActive: true | false }
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean")
      return res
        .status(400)
        .json({ success: false, message: "isActive must be boolean" });

    const updated = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select("-password");
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res
      .status(200)
      .json({ success: true, message: "User status updated", data: updated });
  } catch (error) {
    console.error("updateUserStatus error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
