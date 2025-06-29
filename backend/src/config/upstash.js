import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import dotenv from "dotenv";
dotenv.config();
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  //creating a ratelimiter that allows 100 requests per minute
  limiter: Ratelimit.slidingWindow(100, "60 s"),
});

export default ratelimit;
