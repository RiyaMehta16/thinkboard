import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Note from "../models/Note.js";
// Generate JWT: // Helper function to create token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create and save new user
    const user = await User.create({ username, email, password });

    // Send back user info + token
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    if (error.code === 11000 && error.keyValue.email) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    // Use method from User model to match hashed password
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req, res) => {
  // req.user is set by authMiddleware using token
  const fetchedUser = await User.findById(req.user.id).select("-password"); // remove password
  res.json(fetchedUser);
};

export const deleteUser = async (req, res) => {
  try {
    const fetchedUser = await User.findById(req.user.id);
    if (!fetchedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🧹 Delete all notes belonging to the user in one go
    await Note.deleteMany({ user: req.user.id });

    // 🧹 Delete the user
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      message: "User and their notes deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
