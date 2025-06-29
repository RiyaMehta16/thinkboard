import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my-rate-limit");
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
