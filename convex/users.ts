import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    clerk_id: v.string(),
    stripeCustomerId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", args.clerk_id))
      .first();
    if (user) {
      console.log("user already exists");
      return user._id;
    }
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      clerk_id: args.clerk_id,
      stripeCustomerId: args.stripeCustomerId,
    });
    return userId;
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", args.clerkId))
      .unique();
  },
});

export const getUserByStripeCustomerId = query({
  args: { stripeCustomerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_stripeCustomerId", (q) =>
        q.eq("stripeCustomerId", args.stripeCustomerId)
      )
      .unique();
  },
});

export const getUserAccess = query({
  args: { courseId: v.id("courses"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    //doubt
    if (user.currentSubscriptionId) {
      const subscriptionId = ctx.db.normalizeId(
        "subscriptions",
        user.currentSubscriptionId as unknown as string
      );
      const subscription = subscriptionId
        ? await ctx.db.get(subscriptionId)
        : null;
      if (subscription && subscription.status === "active") {
        return { hasAccess: true, accessType: "subscribed" };
      }
    }

    const purchase = await ctx.db
      .query("purchases")
      .withIndex("by_userId_and_courseId", (q) =>
        q.eq("userId", args.userId).eq("courseId", args.courseId)
      )
      .unique();

    if (purchase) {
      return { hasAccess: true, accessType: "course" };
    }

    return { hasAccess: false };
  },
});
