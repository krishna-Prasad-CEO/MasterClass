import { Ratelimit } from "@upstash/ratelimit";
import Redis from "./redis";

const ratelimit = new Ratelimit({
  redis: Redis,
  limiter: Ratelimit.slidingWindow(3, "60 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export default ratelimit;
