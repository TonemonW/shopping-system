"use client"
import { VariantsWithImagesTags } from "@/lib/infer-type"
import { motion } from "motion/react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"



function ProductTypeContent({
    variants,
}: {
    variants: VariantsWithImagesTags[]
}) {
    const searchParams = useSearchParams()
    const selectedType = searchParams.get("type") || variants[0].productType

    return variants.map((variant) => {
        if (variant.productType === selectedType) {
            return (
                <motion.div
                    key={variant.id}
                    animate={{ y: 0, opacity: 1 }}
                    initial={{ opacity: 0, y: 6 }}
                    className="text-secondary-foreground font-medium"
                >
                    {selectedType}
                </motion.div>
            )
        }
    })
}
export default function ProductForm({
    variants,
}: {
    variants: VariantsWithImagesTags[]
}) {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ProductTypeContent variants={variants} />
        </Suspense>
    )
}