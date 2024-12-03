"use server"
import { createSafeActionClient } from 'next-safe-action'
import { LoginSchema } from '@/types/login-schema';
import { eq } from "drizzle-orm"
import { db } from ".."
import { users, twoFactorTokens } from "../schema"
import { generateEmailVerificationToken, generateTwoFactorToken, getTwoFactorTokenByEmail } from './token';
import { sendTwoFactorEmail, sendVerificationEmail } from './email';
import { signIn } from '../auth';
import { AuthError } from 'next-auth';


const actionClient = createSafeActionClient();

export const emailSignIn = actionClient
    .schema(LoginSchema)
    .action(async ({ parsedInput: { email, password, code } }) => {

        try {
            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, email)
            })

            if (existingUser?.email !== email) {
                return { error: "Email not found" }
            }
            if (!existingUser.emailVerified) {
                const verificationToken = await generateEmailVerificationToken(existingUser.email)
                await sendVerificationEmail(verificationToken.email, verificationToken.token)
                return { success: 'Confirmation Email Sent!!' }
            }

            if (existingUser.twoFactorEnabled && existingUser.email) {
                if (code) {
                    const twoFactorToken = await getTwoFactorTokenByEmail(
                        existingUser.email
                    )
                    if (!twoFactorToken) {
                        return { error: 'Invalid Token' }
                    }
                    if (twoFactorToken.token !== code) {
                        return { error: 'Invalid Token' }
                    }
                    const hasExpired = new Date(twoFactorToken.expires) < new Date()
                    if (hasExpired) {
                        return { error: "Token has expired" }
                    }
                    await db
                        .delete(twoFactorTokens)
                        .where(eq(twoFactorTokens.id, twoFactorToken.id))

                    const existingConfirmation = await getTwoFactorTokenByEmail(
                        existingUser.email
                    )
                    if (existingConfirmation) {
                        await db
                            .delete(twoFactorTokens)
                            .where(eq(twoFactorTokens.email, existingUser.email))
                    }
                } else {
                    const token = await generateTwoFactorToken(existingUser.email);
                    if (!token) {
                        return { error: "Token not generated!" }
                    }
                    await sendTwoFactorEmail(token.email, token.token);
                    return { twoFactor: "Two Factor Token Sent!" }
                }
            }
            await signIn('credentials', {
                email,
                password,
                redirectTo: "/"
            })
            return { success: email }

        } catch (error) {
            console.log(error)
            if (error instanceof AuthError) {
                switch (error.type) {
                    case 'CredentialsSignin':
                        return { error: "Email or Password Incorrect" }
                    case 'AccessDenied':
                        return { error: error.message }
                    case 'OAuthSignInError':
                        return { error: error.message }
                    default:
                        return { error: "Something wrong!" }
                }
            }
            throw error
        }


    })
