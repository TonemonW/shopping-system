"use client"

import { AuthCard } from "@/components/auth/auth-card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useState, Suspense } from "react"; // 导入 Suspense
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { NewPasswordSchema } from "@/types/new-password-schema";
import { newPassword } from "@/server/actions/new-password";
import { useSearchParams } from "next/navigation";

export const NewPasswordForm = () => {
    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
        },
    });

    // Suspense 处理 searchParams 获取
    const SearchParamsWrapper = () => {
        const searchParams = useSearchParams();
        const token = searchParams.get('token');
        return <PasswordForm token={token} />;
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchParamsWrapper />
        </Suspense>
    );
};

const PasswordForm = ({ token }: { token: string | null }) => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { execute, status } = useAction(newPassword, {
        onSuccess(response) {
            const data = response?.data;
            if (data?.error) setError(data.error);
            if (data?.success) setSuccess(data.success);
        }
    });

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        if (token) {
            execute({ password: values.password, token });
        } else {
            setError("Invalid token.");
        }
    };

    return (
        <AuthCard
            cardTitle="Enter a new password"
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block">Password</FormLabel>
                                        <FormControl>
                                            <input
                                                {...field}
                                                placeholder="********"
                                                type="password"
                                                autoComplete="current-password"
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
    );
};
