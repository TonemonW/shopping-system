"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"


export default function ProductTags() {
    const router = useRouter()
    const params = useSearchParams()
    const tag = params.get("tag")
    const setFilter = (tag: string) => {
        if (tag) {
            router.push(`?tag=${tag}`)
        }
        if (!tag) {
            router.push("/")
        }
    }
    return (
        <div className="w-full my-4 flex gap-4 items-center justify-center">
            <Badge
                onClick={() => setFilter("")}
                className={cn(
                    "cursor-pointer bg-primary hover:bg-primary/75 hover:opacity-100",
                    !tag ? "opacity-100" : "opacity-50"
                )}
            >
                All
            </Badge>
            <Badge
                onClick={() => setFilter("Duffy")}
                className={cn(
                    "cursor-pointer bg-[rgb(196,141,90)] hover:bg-[rgb(216,161,110)] hover:opacity-100",
                    tag === "Duffy" && tag ? "opacity-100" : "opacity-50"
                )}
            >
                Duffy
            </Badge>
            <Badge
                onClick={() => setFilter("LinaBell")}
                className={cn(
                    "cursor-pointer bg-[rgb(255,168,168)] hover:bg-[rgb(255,188,188)]  hover:opacity-100",
                    tag === "LinaBell" && tag ? "opacity-100" : "opacity-50"
                )}
            >
                LinaBell
            </Badge>
            <Badge
                onClick={() => setFilter("OluMel")}
                className={cn(
                    "cursor-pointer bg-[rgb(131,233,129)] hover:bg-[rgb(151,253,149)]  hover:opacity-100",
                    tag === "OluMel" && tag ? "opacity-100" : "opacity-50"
                )}
            >
                OluMel
            </Badge>
            <Badge
                onClick={() => setFilter("StellaLou")}
                className={cn(
                    "cursor-pointer bg-[rgb(193,108,249)] hover:bg-[rgb(213,128,255)]  hover:opacity-100",
                    tag === "StellaLou" && tag ? "opacity-100" : "opacity-50"
                )}
            >
                StellaLou
            </Badge>
        </div>
    )
}