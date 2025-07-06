import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  let token;

  // Step 1: Check if Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Step 2: Extract the token from the "Bearer token" format
      token = req.headers.authorization.split(" ")[1];

      // Step 3: Decode the token using your JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Step 4: Find the user by decoded.id and attach to req.user 🔴 remember🔴; now there will be user in request too!
      req.user = await User.findById(decoded.id).select("-password");

      // Step 5: Continue to the next middleware or route
      next();
    } catch (err) {
      console.error("Token verification failed", err);
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default authMiddleware;
