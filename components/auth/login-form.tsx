"use client"

import { AuthCard } from "@/components/auth/auth-card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/types/login-schema";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { emailSignIn } from "@/server/actions/email-signin";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils"
import { useState } from "react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"


export const LoginForm = () => {
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showTwoFactor, setShowTwoFactor] = useState(false)

    const { execute, status } = useAction(emailSignIn, {
        onSuccess(response) {
            console.log(response);
            const data = response?.data;
            if (data?.error) setError(data.error)
            if (data?.success) setSuccess(data.success)
            if (data?.twoFactor) setShowTwoFactor(true)
        }
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        execute(values)
    }
    return (
        <AuthCard cardTitle="Welcome Back!"
            backButtonHref="/auth/register"
            backButtonLabel="Create your account"
            showSocials
        >
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col items-center mb-3">
                            {showTwoFactor && (
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block">Two Factor Code sent!</FormLabel>
                                            <FormControl>
                                                <InputOTP
                                                    disabled={status === 'executing'}
                                                    {...field} maxLength={6}>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} />
                                                        <InputOTPSlot index={1} />
                                                        <InputOTPSlot index={2} />
                                                        <InputOTPSlot index={3} />
                                                        <InputOTPSlot index={4} />
                                                        <InputOTPSlot index={5} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                            <FormDescription />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />)}
                            {!showTwoFactor && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="block">Email</FormLabel>
                                                <FormControl>
                                                    <input
                                                        {...field}
                                                        placeholder="example@gmail.com"
                                                        type="email"
                                                        autoComplete="email" />
                                                </FormControl>
                                                <FormDescription />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="block">Password</FormLabel>
                                                <FormControl>
                                                    <input
                                                        {...field}
                                                        placeholder="********"
                                                        type="password"
                                                        autoComplete="current-password" />
                                                </FormControl>
                                                <FormDescription />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>)}
                            <FormSuccess message={success} />
                            <FormError message={error} />
                            <Button size={"sm"} className="px-0" variant={"link"} asChild>
                                <Link href='/auth/reset'>Forgot your password</Link>
                            </Button>
                        </div>
                        <Button type="submit"
                            className={cn(
                                "w-full my-4",
                                status === "executing" ? "animate-pulse" : ""
                            )}>
                            {showTwoFactor ? "Verify" : "Sign In"}
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    )
}