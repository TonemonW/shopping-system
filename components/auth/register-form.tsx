"use client"


import { AuthCard } from "@/components/auth/auth-card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/types/register-schema";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils"
import { useState } from "react";
import { emailRegister } from "@/server/actions/email-register";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";

export const RegisterForm = () => {
    const form = useForm({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: ""
        },
    });

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const { execute, status } = useAction(emailRegister, {
        onSuccess(response) {
            const data = response?.data;
            if (data?.error) setError(data.error)
            if (data?.success) setSuccess(data.success)
        }
    })

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        execute(values)
    }
    return (
        <AuthCard cardTitle="Create an account"
            backButtonHref="/auth/login"
            backButtonLabel="Already have an account?"
            showSocials
        >
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col items-center mb-3">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block">Username</FormLabel>
                                        <FormControl>
                                            <input
                                                {...field}
                                                placeholder="example"
                                                type="text" />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                            <FormSuccess message={success} />
                            <FormError message={error} />
                            <Button size={"sm"} variant={"link"} asChild>
                                <Link href='/auth/reset'>Forgot your password</Link>
                            </Button>
                        </div>
                        <Button type="submit"
                            className={cn(
                                "w-full",
                                status === "executing" ? "animate-pulse" : ""
                            )}>
                            Register
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    )
}