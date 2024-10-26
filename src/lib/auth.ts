import type { User } from "~/db/schema/users";

import { currentUser } from "@clerk/nextjs/server";
import consola from "consola";

import { env } from "~/env";

const authProvider = Boolean(env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

const GuestSession = async (): Promise<User> => ({
  id: "guestId",
  name: "guestName",
  age: 18,
  createdAt: new Date("2024-07-10T00:00:00.000Z"),
  currentCartId: "guestCurrentCartId",
  email: "guest@email.com",
  emailVerified: new Date("2024-07-10T00:00:00.000Z"),
  hashedPassword: "guestHashedPassword",
  image: "https://bleverse.com/logo.png",
  mode: "buyer",
  role: "user",
  status: "guest",
  stripeCurrentPeriodEnd: "guestStripeCurrentPeriodEnd",
  stripeCustomerId: "guestStripeCustomerId",
  stripePriceId: "guestStripePriceId",
  stripeSubscriptionId: "guestStripeSubscriptionId",
  updatedAt: new Date("2024-07-10T00:00:00.000Z"),
});

const ClerkSession = async (): Promise<User> => {
  const guest = await GuestSession();
  const user = await currentUser();

  if (!user) {
    return guest;
  }

  return {
    id: user.id || guest.id,
    name: user.fullName || "Unknown",
    age: 18,
    createdAt: new Date(user.createdAt) || new Date("2024-07-10T00:00:00.000Z"),
    currentCartId: "guestCurrentCartId",
    email: user.primaryEmailAddress?.emailAddress || guest.email,
    emailVerified: new Date("2024-07-10T00:00:00.000Z"),
    hashedPassword: "guestHashedPassword",
    image: user.imageUrl || guest.image,
    mode: "buyer",
    role: "user",
    status: "guest",
    stripeCurrentPeriodEnd: "guestStripeCurrentPeriodEnd",
    stripeCustomerId: "guestStripeCustomerId",
    stripePriceId: "guestStripePriceId",
    stripeSubscriptionId: "guestStripeSubscriptionId",
    updatedAt: new Date(user.updatedAt) || new Date("2024-07-10T00:00:00.000Z"),
  };
};

export async function clerk(): Promise<User> {
  if (!env.DATABASE_URL) {
    return await GuestSession();
  }

  if (!authProvider) {
    consola.warn(
      "Please set or correct authProvider in the `reliverse.config.ts` file to enable user authentication with real data. The app is currently using guest data.",
    );

    return await GuestSession();
  }

  let session;

  try {
    session = authProvider ? await ClerkSession() : await GuestSession();
  } catch (error) {
    consola.error("🐞 Error in fetching Clerk session", error);
    session = await GuestSession();
  }

  return session;
}
