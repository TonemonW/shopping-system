"use server"
import { eq } from "drizzle-orm"
import { db } from ".."
import { emailTokens, passwordResetTokens, twoFactorTokens, users } from "../schema"
import * as crypto from "crypto";


export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await db.query.emailTokens.findFirst({
            where: eq(emailTokens.email, email)
        })
        return verificationToken
    } catch (error) {
        return console.log(error)
    }
}

interface VerificationToken {
    id: string;
    email: string;
    token: string;
    expires: Date;
}
export const generateEmailVerificationToken = async (email: string): Promise<VerificationToken> => {
    const token = crypto.randomUUID()
    const expires = new Date(new Date().getTime() + 3600 * 1000)
    const existingToken = await getVerificationTokenByEmail(email)
    if (existingToken) {
        await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id))
    }
    const [verificationToken] = await db.insert(emailTokens).values({
        email,
        token,
        expires
    }).returning()
    return verificationToken;
}

export const newVerification = async (token: string) => {
    const existingToken = await db.query.emailTokens.findFirst({
        where: eq(emailTokens.token, token),
    });
    if (!existingToken) return {
        error: "Token not found"
    }
    const hasExpired = new Date(existingToken.expires) < new Date()
    if (hasExpired) return { error: "TOken has expired" }

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, existingToken.email)
    })
    if (!existingUser) return { error: "Email does not exist" }

    await db.update(users).set({
        emailVerified: new Date(),
    }).where(eq(users.email, existingToken.email));

    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));

    return { success: "Email verified successfully" };
}

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const passwordResetToken = await db.query.passwordResetTokens.findFirst({
            where: eq(passwordResetTokens.token, token)
        })
        return passwordResetToken
    } catch {
        return null
    }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passwordResetToken = await db.query.passwordResetTokens.findFirst({
            where: eq(passwordResetTokens.email, email)
        })
        return passwordResetToken
    } catch {
        return null
    }
}

export const generatePasswordResetToken = async (email: string): Promise<VerificationToken> => {
    const token = crypto.randomUUID()
    const expires = new Date(new Date().getTime() + 3600 * 1000)
    const existingToken = await getPasswordResetTokenByEmail(email)
    if (existingToken) {
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id))
    }
    const [passwordResetToken] = await db.insert(passwordResetTokens).values({
        email,
        token,
        expires
    }).returning()
    return passwordResetToken;
}

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        const twoFactorToken = await db.query.twoFactorTokens.findFirst({
            where: eq(twoFactorTokens.email, email)
        })
        return twoFactorToken
    } catch {
        return null
    }
}

export const getTwoFactorTokenByToken = async (token: string) => {
    try {
        const twoFactorToken = await db.query.twoFactorTokens.findFirst({
            where: eq(twoFactorTokens.token, token)
        })
        return twoFactorToken
    } catch {
        return null
    }
}

export const generateTwoFactorToken = async (email: string): Promise<VerificationToken> => {
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 3600 * 1000)
    const existingToken = await getTwoFactorTokenByEmail(email)
    if (existingToken) {
        await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, existingToken.id))
    }
    const [twoFactorToken] = await db.insert(twoFactorTokens).values({
        email,
        token,
        expires
    }).returning()
    return twoFactorToken;
}