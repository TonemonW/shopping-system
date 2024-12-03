"use server"

import getBaseURL from "@/lib/base-url"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const domain = getBaseURL()

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: [email],
            subject: 'Confirmation Email',
            html: `<p>Click to <a href='${confirmLink}'>confirm your email</a></p>`
        });

        if (error) return console.log(error)
        if (data) return data

    } catch (err) {
        console.error("Unexpected error in sendVerificationEmail:", err);
        throw err;
    }
};
export const sendPasswordResetEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-password?token=${token}`
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: [email],
            subject: 'Confirmation Email',
            html: `<p>Click to <a href='${confirmLink}'>reset your password</a></p>`
        });

        if (error) return console.log(error)
        if (data) return data

    } catch (err) {
        console.error("Unexpected error in sendPasswordResetEmail:", err);
        throw err;
    }
};

export const sendTwoFactorEmail = async (email: string, token: string) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: [email],
            subject: 'Your 2 Factor Token',
            html: `<p>Your Confirmation Code:${token}</a></p>`
        });

        if (error) return console.log(error)
        if (data) return data

    } catch (err) {
        console.error("Unexpected error in sendTwoFactorEmail:", err);
        throw err;
    }
};