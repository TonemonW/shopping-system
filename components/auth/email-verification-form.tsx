"use client"

import { newVerification } from "@/server/actions/token";
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Suspense, useCallback, useEffect, useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";

const EmailVerification = () => {
    const token = useSearchParams().get("token")
    const router = useRouter()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleVerification = useCallback(() => {
        if (success || error) return
        if (!token) {
            setError("No token found")
            return
        }
        newVerification(token).then((data) => {
            if (data.error) {
                setError(data.error)
            }

            if (data.success) {
                setSuccess(data.success)
                setTimeout(() => {
                    router.push("/auth/login")
                }, 3000);
            }
        })
    }, [])

    useEffect(() => {
        handleVerification()
    }, [])
    return <AuthCard
        backButtonLabel="Back to login"
        backButtonHref="/auth/login"
        cardTitle="Verify your account"
    >

        <div className="flex items-center flex-col w-full justify-center">
            <p>{!success && !error ? 'Verifying email...' : null}</p>
            <FormSuccess message={success} />
            <FormError message={error} />
        </div>
    </AuthCard>
}

export default function EmailVerificationForm() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <EmailVerification />
        </Suspense>
    )
}