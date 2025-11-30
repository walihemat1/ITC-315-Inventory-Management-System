import User from "../models/userModel.js";

export const isAdmin = async (req, res, next) => {
  try {
    const currentLoggedInUser = await User.findById(req?.user?._id);

    if (!currentLoggedInUser)
      return res.status(400).json({
        success: false,
        message: "User is not logged in.",
      });

    if (currentLoggedInUser.role !== "admin")
      return res.status(401).json({
        success: false,
        message: "Unathorized",
      });

    next();
  } catch (error) {
    console.log("Error in isAdmin middleware: ", error);
    res.status(500).json({
      success: false,
      error: error.message || "Something went wrong",
    });
  }
};
