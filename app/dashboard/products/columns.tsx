"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { MoreHorizontal, PlusCircle } from "lucide-react"
import { deleteProduct } from "@/server/actions/delete-product"
import { toast } from "sonner"
import { useAction } from "next-safe-action/hooks"
import Link from "next/link"
import { VariantsWithImagesTags } from "@/lib/infer-type"
import { ProductVariant } from "./product-variant"

type ProductColumn = {
    title: string
    price: number
    image: string
    variants: VariantsWithImagesTags[]
    id: number
}


const Actioncell = ({ row }: { row: Row<ProductColumn> }) => {
    const { status, execute } = useAction(deleteProduct, {
        onSuccess: (response) => {
            if (response.data?.error) {
                toast.error(response.data.error)
            }
            if (response.data?.success) {
                toast.success(response.data.success)
            }
        },
        onExecute: () => {
            toast.loading("Deleting Product")
        }
    })
    const product = row.original
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem className="dark:focus:bg-primary
            focus:bg-primary/50 cursor-pointer"><Link href={`/dashboard/add-product?id=${product.
                        id}`}>
                        Edit Product
                    </Link></DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => execute({ id: product.id })} className="dark:focus:bg-destructive
            focus:bg-destructive/50 cursor-pointer">Delete Product</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "id",
        header: "ID"
    },
    {
        accessorKey: "title",
        header: "Title"
    },
    {
        accessorKey: "variants",
        header: "Variants",
        cell: ({ row }) => {
            const variants = row.getValue("variants") as VariantsWithImagesTags[]
            return (
                <div>
                    {variants.map((variant) => (
                        <TooltipProvider key={variant.id}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <ProductVariant
                                        productID={variant.productID}
                                        variant={variant}
                                        editMode={true}>
                                        <div
                                            className="w-5 h-5 rounded-full mr-1"
                                            key={variant.id}
                                            style={{ backgroundColor: variant.color }}
                                        />
                                    </ProductVariant>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{variant.productType}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ProductVariant productID={row.original.id} editMode={false}>
                                    <PlusCircle className="h-5 w-5" />
                                </ProductVariant>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Create a new product variant</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )
        },
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("en-US", {
                currency: "AUD",
                style: "currency",
            }).format(price)
            return <div className="font-medium text-sm">
                {formatted}</div>
        },
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
            const cellImage = row.getValue("image") as string
            const cellTitle = row.getValue("title") as string
            return (
                <div className="">
                    <Image
                        src={cellImage}
                        alt={cellTitle}
                        width={50}
                        height={50}
                        className="rounded-md"
                    />
                </div>
            )
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: Actioncell,
    }
]
