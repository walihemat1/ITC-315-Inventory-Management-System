import User from "../models/userModel.js";
import { generateToken } from "../utils/jwt_token.js";

export const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName)
      return res.status(401).json({
        success: false,
        message: "email, password and fullName are required",
      });

    const existedUser = await User.findOne({ email });
    if (existedUser)
      return res.status(400).json({
        success: false,
        message: `User with this email already exits`,
      });

    const user = await User.create(req.body);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error in register controller: ", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });

    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

    const matchedPassword = await user.comparePasswords(password);
    if (!matchedPassword)
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

    //generate token
    const token = generateToken(res, user._id);

    res.cookie("token", token, {
      maxAge: 24 * 7 * 60 * 60 * 1000,
      httpOnly: process.env.NODE_ENV === "production" ? true : false,
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      data: {
        email: user.email,
        username: user.username,
        id: user._id,
      },
      token,
    });
  } catch (error) {
    console.log("Error in login controller: ", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "");
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};
