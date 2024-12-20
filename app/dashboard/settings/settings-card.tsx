"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Session } from "next-auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SettingsSchema } from "@/types/settings-schema"
import Image from 'next/image';
import { Switch } from "@/components/ui/switch"
import { FormSuccess } from "@/components/auth/form-success";
import { FormError } from "@/components/auth/form-error";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { settings } from "@/server/actions/settings"
import { UploadButton } from "@uploadthing/react"
import { OurFileRouter } from "../../api/uploadthing/core";

type SettingsForm = {
    session: Session
}

export default function SettingsCard(session: SettingsForm) {
    const [error, setError] = useState<string | undefined>(undefined)
    const [success, setSuccess] = useState<string | undefined>(undefined)
    const [avatarUploading, setAvatarUploading] = useState(false)

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            password: "",
            newPassword: "",
            name: session.session.user?.name || "",
            email: session.session.user?.email || "",
            image: session.session.user?.image || "",
            isTwoFactorEnabled: session.session.user?.isTwoFactorEnabled || false
        },
    });

    const { execute, status } = useAction(settings, {
        onSuccess(response) {
            const data = response?.data;
            if (data?.error) setError(data.error)
            if (data?.success) setSuccess(data.success)
        },
        onError: () => {
            setError("Something went wrong")
        }
    })

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        execute(values)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Settings</CardTitle>
                <CardDescription>Update your account settings</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <input
                                            placeholder="Your name"
                                            disabled={status === 'executing'}
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Avatar</FormLabel>
                                    <div className="flex items-center gap-4 ">
                                        {!form.getValues('image') && (
                                            <div className="font-bold">
                                                {session.session.user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        {form.getValues("image") && (
                                            <Image
                                                src={form.getValues("image")!}
                                                alt="User Image"
                                                width={42} // 图片宽度
                                                height={42} // 图片高度
                                                className="rounded-full"
                                            />
                                        )}
                                        <UploadButton<OurFileRouter, "avatarUploader">
                                            className="scale-75 ut-button:bg-primary/75 ut-button:ring-primary hover:ut-button:bg-primary/100 ut:button:transition-all ut-button:duration-500 ut-label:hidden ut-allowed-content:hidden"
                                            endpoint="avatarUploader"
                                            onUploadBegin={() => {
                                                setAvatarUploading(true)
                                            }}
                                            onUploadError={(error: Error) => {
                                                form.setError("image",
                                                    {
                                                        type: 'validate',
                                                        message: error.message
                                                    })
                                                setAvatarUploading(false)
                                                return
                                            }}
                                            onClientUploadComplete={(res) => {
                                                form.setValue('image', res[0].url!)
                                                setAvatarUploading(false)
                                                return
                                            }}
                                            content={{
                                                button({ ready }) {
                                                    if (ready) return <div>Change Avatar</div>
                                                    return <div>Uploading...</div>
                                                }
                                            }}
                                        />
                                    </div>
                                    <FormControl>
                                        <input
                                            placeholder="Your Image"
                                            type="hidden"
                                            disabled={status === 'executing'}
                                            {...field} />
                                    </FormControl>

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
                                            disabled={status === 'executing' || session?.session.user.isOAuth} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block">New Password</FormLabel>
                                    <FormControl>
                                        <input
                                            {...field}
                                            placeholder="********"
                                            type="password"
                                            disabled={status === 'executing' || session?.session.user.isOAuth} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isTwoFactorEnabled"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block">Two Factor Authentication</FormLabel>
                                    <FormDescription>
                                        Enable two factor authentication for your account.
                                    </FormDescription>
                                    <FormControl>
                                        <Switch
                                            disabled={status === 'executing' || session.session.user.isOAuth === true}
                                            checked={field.value}
                                            onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormSuccess message={success} />
                        <FormError message={error} />
                        <Button type="submit" disabled={status === 'executing' || avatarUploading}>Update your settings</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
