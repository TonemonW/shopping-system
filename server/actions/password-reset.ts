"use server"

import { createSafeActionClient } from "next-safe-action"
import { eq } from "drizzle-orm"
import { db } from ".."
import { ResetSchema } from "@/types/reset-schema"
import { generatePasswordResetToken } from "./token"
import { sendPasswordResetEmail } from "./email"
import { users } from "../schema"

const actionClient = createSafeActionClient();

export const reset = actionClient
    .schema(ResetSchema)
    .action(async ({ parsedInput: { email } }) => {
        if (!email) {
            return { error: "Missing Email" }
        }

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })

        if (!existingUser) {
            return { error: "User not found" }
        }
        const passwordResetToken = await generatePasswordResetToken(email)
        if (!passwordResetToken) {
            return { error: "Token not generated" }
        }
        await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)
        return { success: "Confirmation Email Sent" }
    })