"use server";

import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { api } from "./_generated/api";
import { stripe } from "../src/lib/stripe";

const http = httpRouter();
const clerkWebhook = httpAction(async (ctx, req) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET is not set");
  }
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook", err);
    console.error(err);
    return new Response("Error occured", {
      status: 400,
    });
  }
  const eventType = evt.type;
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0].email_address;
    const name = `${first_name} ${last_name}`;
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: { clerkId: id },
      });
      await ctx.runMutation(api.users.createUser, {
        email,
        name,
        clerk_id: id,
        stripeCustomerId: customer.id,
      });
    } catch (error) {
      console.log("Error creating user", error);
      return new Response("Error occured", {
        status: 500,
      });
    }
  }
  return new Response("Webhook processed Successfully", { status: 201 });
});

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: clerkWebhook,
});

export default http;
