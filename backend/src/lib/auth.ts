import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { jwt, openAPI } from "better-auth/plugins";



export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trustedOrigins: ["http://localhost:3001"],
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        jwt(),
        openAPI(),
    ]
})