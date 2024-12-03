"use client"
import { Session } from "next-auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Moon, Settings, Sun, TruckIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes"
import { useState } from "react";
import { Switch } from "../ui/switch";
import { useRouter } from "next/navigation";


export const UserButton = ({ user }: Session) => {
    const { setTheme, theme } = useTheme()
    const [checked, setChecked] = useState(false)
    const router = useRouter()
    if (user)
        return (
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar className="w-8 h-8">
                        {user.image ? (
                            <AvatarImage src={user.image} alt={user.name!} />
                        ) : (
                            <AvatarFallback className="bg-primary/25">
                                <div className="font-bold">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                            </AvatarFallback>
                        )}
                    </Avatar>

                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-6" align="end">
                    <div className="mb-4 p-4 flex flex-col items-center gap-1 rounded-lg bg-primary/10">
                        <Avatar>
                            {user.image && (
                                <AvatarImage
                                    src={user.image}
                                    alt={user.name!}
                                    className="rounded-full"
                                    width={50}
                                    height={50}
                                />
                            )}
                        </Avatar>
                        <p className="font-bold text-xs">{user.name}</p>
                        <span className="text-xs font-medium text-secondary-foreground">
                            {user.email}
                        </span>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/dashboard/orders")} className="group py-2 font-medium cursor-pointer">
                        <TruckIcon size={14} className="mr-2 group-hover:translate-x-1 transition-all duration-300 ease-in-out" />My orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/dashboard/settings")} className="group py-2 font-medium cursor-pointer">
                        <Settings size={14} className="mr-2 group-hover:rotate-180 transition-all duration-300 ease-in-out" />Settings
                    </DropdownMenuItem>
                    {theme && (
                        <DropdownMenuItem className="group py-2 font-medium cursor-pointer">
                            <div className="flex items-center group">
                                {checked ? (
                                    <Moon size={14} className="group-hover:scale-125 group-hover:text-blue-300 transition-all duration-400 ease-in-out mr-4" />
                                ) : (
                                    <Sun size={14} className="group-hover:scale-125 group-hover:text-yellow-600 transition-all duration-400 ease-in-out mr-4" />
                                )}
                                <p className="dark:text-blue-200 text-secondary-foreground/75 text-yellow-600">
                                    {theme[0].toUpperCase() + theme.slice(1)}
                                </p>
                                <Switch
                                    className="ml-3 scale-75"
                                    checked={checked}
                                    onCheckedChange={(e) => {
                                        setChecked((prev) => !prev);
                                        if (e) setTheme("dark");
                                        if (!e) setTheme("light");
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                        onClick={() => signOut()}
                        className="group py-2 font-medium focus:bg-destructive/30 cursor-pointer"
                    >
                        <LogOut className="mr-2 group-hover:scale-75 transition-all duration-300 ease-in-out" />
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
}