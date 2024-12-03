"use server"
import { createSafeActionClient } from 'next-safe-action'
import { RegisterSchema } from '@/types/register-schema';
import bcrypt from 'bcrypt'
import { eq } from "drizzle-orm"
import { db } from ".."
import { users } from "../schema"
import { generateEmailVerificationToken } from './token';
import { sendVerificationEmail } from './email'

const actionClient = createSafeActionClient();

export const emailRegister = actionClient
    .schema(RegisterSchema)
    .action(async ({ parsedInput: { email, password, name } }) => {
        const hashedPassword = await bcrypt.hash(password, 10)
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })
        if (existingUser) {
            if (!existingUser.emailVerified) {
                const verificationToken = await generateEmailVerificationToken(email);
                await sendVerificationEmail(
                    verificationToken.email,
                    verificationToken.token)
                return { success: "Email Confirmation resent" }
            }
            return { error: "Email already registered" };
        }
        await db.insert(users).values({
            email,
            name,
            password: hashedPassword
        })
        const verificationToken = await generateEmailVerificationToken(email)
        console.log()
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token)
        return { success: "Register success" }
    })
