"use client"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import { usePathname } from "next/navigation"

export default function DashboardNav({ allLinks }: {
    allLinks: { label: string; path: string; icon: JSX.Element }[]
}) {
    const pathname = usePathname()
    return (
        <nav className="overflow-auto mt-5 h-14">
            <ul className="flex gap-6 font-bold text-sm">
                <AnimatePresence>
                    {allLinks.map((link) => (
                        <motion.li whileTap={{ scale: 0.9 }} key={link.label}>
                            <Link
                                className={cn("flex gap-1 flex-col items-center relative", pathname === link.path && "text-primary"
                                )}
                                href={link.path}>
                                {link.icon}
                                {link.label}
                                {pathname === link.path ? (
                                    <motion.div
                                        className="h-[3px] w-full rounded-full absolute bg-primary z-0 left-0 -bottom-1"
                                        initial={{ scale: 0.5 }}
                                        animate={{ scale: 1 }}
                                        layoutId="underline"
                                        transition={{ type: "spring", stiffness: 35 }}
                                    />
                                ) : null}
                            </Link>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
        </nav>
    )
}