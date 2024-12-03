"use client"

import { AuthCard } from "@/components/auth/auth-card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils"
import { useState } from "react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { ResetSchema } from "@/types/reset-schema";
import { reset } from "@/server/actions/password-reset";


export const ResetForm = () => {
    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        },
    });

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const { execute, status } = useAction(reset, {
        onSuccess(response) {
            const data = response?.data;
            if (data?.error) setError(data.error)
            if (data?.success) setSuccess(data.success)
        }
    })

    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        execute(values)
    }
    return (
        <AuthCard
            cardTitle="Forgot your password?"
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
            showSocials
        >
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col items-center mb-3">
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
                                                autoComplete="email"
                                                disabled={status === "executing"}
                                            />
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
                            Reset Password
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    )
}