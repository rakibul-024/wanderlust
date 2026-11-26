import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { client, db } from "@/lib/mongodb";

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: (process.env.GITHUB_CLIENT_ID ?? "").trim(),
      clientSecret: (process.env.GITHUB_CLIENT_SECRET ?? "").trim(),
    },
    google: {
      clientId: (process.env.GOOGLE_CLIENT_ID ?? "").trim(),
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET ?? "").trim(),
    },
  },
});
