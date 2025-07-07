import ratelimit from "../config/upstash.js";
import jwt from "jsonwebtoken";

const rateLimiter = async (req, res, next) => {
  /*
-------------------------------------------------
WITH IDENTIFIER
This means:
- Authenticated users are rate-limited individually by their user ID.
- Unauthenticated users are rate-limited by IP (so public routes still get limited).
-------------------------------------------------
*/
  try {
    // Get the token from Authorization header
    console.log("🔁 Rate limiter triggered for:", req.method, req.originalUrl);

    const authHeader = req.headers.authorization;

    let identifier = req.ip; // fallback for unauthenticated routes

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        identifier = decoded.id; // Use user_id from token
      } catch (err) {
        console.warn("Token invalid or expired, falling back to IP");
      }
    }

    const { success } = await ratelimit.limit(identifier); // identifier is either user_id or IP

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later",
      });
    }

    next();
  } catch (error) {
    console.error("Rate Limit Error : ", error);
    next(error);
  }
};

export default rateLimiter;
/*
-------------------------------------------------
WITHOUT PROPER IDENTIFIER
-------------------------------------------------
import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("hi");
    //if any user sends 100 requests per minute, services will be blocked for all the users. This is why we need an identifier to block service per user.
    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later",
      });
    }
    next();
  } catch (error) {
    console.error("Rate Limit Error : ", error);
    next(error);
  }
};
export default rateLimiter;
*/
