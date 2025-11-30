import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({
        success: false,
        message: "No token was found",
      });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid. Please log in again",
      });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user)
      return res.status(401).json({
        success: false,
        message: "User not found",
      });

    if (!user.isActive)
      return res.status(403).json({
        success: false,
        message: "Your account is deactivated. Contact admin.",
      });

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in authenticateUser: ", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
