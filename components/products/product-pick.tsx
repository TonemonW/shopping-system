"use client"

import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ProductPickContent({
    id,
    color,
    productType,
    title,
    price,
    productID,
    image,
}: {
    id: number
    color: string
    productType: string
    title: string
    price: number
    productID: number
    image: string
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const selectedcolor = searchParams.get(productType || "type")
    return (
        <div
            style={{ background: color }}
            className={cn(
                "w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ease-in-out hober: opacity-75", selectedcolor === productType ? "opacity-100" :
                "opacity-50"
            )}
            onClick={() =>
                router.push(
                    `/products/${id}?id=${id}&productID=${productID}&price=${price}&title=${title}&type=${productType}&image=${image}`,
                    { scroll: false }
                )
            }
        ></div>
    )
}
export default function ProductPick(props: {
    id: number
    color: string
    productType: string
    title: string
    price: number
    productID: number
    image: string
}) {
    return (
        <Suspense fallback={<div className="w-8 h-8 rounded-full bg-gray-200"></div>}>
            <ProductPickContent {...props} />
        </Suspense>
    )
}