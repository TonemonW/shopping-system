import { auth } from "@/server/auth";
import { UserButton } from "@/components/navigation/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import CartDrawer from "../cart/cart-drawer";
import { LogIn } from "lucide-react";

export default async function Nav() {
    const session = await auth()
    return (
        <header className="z-50 h-16">
            <nav className="max-w-6xl mx-auto py-2 px-4">
                <ul className="flex justify-between items-center md:gap-8 gap-2">
                    <li className="flex flex-1">
                        <Link href="/" >
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={50} // 图片宽度
                                height={50} // 图片高度
                                className="hover:scale-125 transform transition-transform duration-300"
                            />
                        </Link>
                    </li>
                    <li className="relative flex items-center hover:bg-muted">
                        <CartDrawer />
                    </li>
                    {!session ? (
                        <li className="flex items-center justify-center">
                            <Button asChild>
                                <Link className="flex gap-2"
                                    href="/auth/login">
                                    <LogIn size={18} />
                                    <span>Login</span></Link>
                            </Button>
                        </li>
                    ) : (<li className="flex items-center justify-center">
                        <UserButton
                            expires={session?.expires}
                            user={session?.user}
                        />
                    </li>
                    )}
                </ul>
            </nav>
        </header>
    )
}