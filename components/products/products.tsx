"use client"

import { VariantsWithProduct } from "@/lib/infer-type"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "../ui/badge"
import formatPrice from "@/lib/format-price"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"

type ProductTypes = {
    variants: VariantsWithProduct[]
}


export default function Products({ variants }: ProductTypes) {
    const params = useSearchParams()
    const paramTag = params.get("tag")
    const filtered = useMemo(() => {
        if (paramTag && variants) {
            return variants.filter((variant) =>
                variant.variantTags.some((tag) => tag.tag === paramTag)
            )
        }
        return variants
    }, [paramTag])

    return (
        <main className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 w-full">
            {filtered.map((variant) => (
                <Link
                    className="py-2 group"  // Add 'group' class for hover effect
                    key={variant.id}
                    href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}>

                    {/* Image */}
                    <div className="relative">
                        <Image
                            className="rounded-md pb-2 w-full transition-all duration-300 group-hover:scale-110 group-hover:brightness-95 object-cover" // Add hover scale/brightness effect
                            src={variant.variantImages[0].url}
                            width={780}
                            height={660}
                            alt={variant.product.title}
                            loading="lazy" />
                    </div>

                    {/* Text and Price */}
                    <div className="flex justify-between mt-2">
                        <div className="font-medium group-hover:text-primary transition-all duration-300">
                            <h2>{variant.product.title}</h2>
                            <p className="text-sm text-muted-foreground
                            group-hover:brightness-125 transition-all duration-300">
                                {variant.productType}
                            </p>
                        </div>
                    </div>

                    {/* Badge */}
                    <div className="flex justify-center">
                        <Badge className="transition-all duration-300 group-hover:text-primary text-lg" variant={"secondary"}>
                            {formatPrice(variant.product.price)}
                        </Badge>
                    </div>


                </Link>
            ))}
        </main>
    )
}
