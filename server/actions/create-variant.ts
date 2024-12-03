"use server"

import { createSafeActionClient } from 'next-safe-action'
import { eq } from "drizzle-orm"
import { db } from ".."
import { products, productVariants, variantImages, variantTags } from "../schema"
import { revalidatePath } from 'next/cache';
import { VariantSchema } from '@/types/variant-schema';
import { searchClient } from '@algolia/client-search';

const actionClient = createSafeActionClient();

const client = searchClient('1YUWPYDZ85', '1d23ee9a2ab5edd9d16b9120bdce51f9');

export const createVariant = actionClient
    .schema(VariantSchema)
    .action(async ({ parsedInput: { color, editMode, id, productID, productType, tags, variantImages: newImgs } }) => {
        try {
            if (editMode && id) {
                const editVariant = await db
                    .update(productVariants)
                    .set({ color, productType, updated: new Date() })
                    .where(eq(productVariants.id, id))
                    .returning()
                await db
                    .delete(variantTags)
                    .where(eq(variantTags.variantID, editVariant[0].id))
                await db.insert(variantTags).values(
                    tags.map((tag) => ({
                        tag,
                        variantID: editVariant[0].id,
                    }))
                )
                await db
                    .delete(variantImages)
                    .where(eq(variantImages.variantID, editVariant[0].id))
                await db.insert(variantImages).values(
                    newImgs.map((img, idx) => ({
                        name: img.name,
                        size: img.size,
                        url: img.url,
                        variantID: editVariant[0].id,
                        order: idx,
                    }))
                )
                client.partialUpdateObjects({
                    indexName: "variant", // 索引名称
                    objects: [
                        {
                            objectID: editVariant[0].id.toString(),
                            id: editVariant[0].productID,
                            productType: editVariant[0].productType,
                            variantImages: newImgs[0].url,
                        },
                    ],
                })
                revalidatePath("/dashboard/products")
                return {
                    success: `Edited ${productType}`
                }
            }
            if (!editMode) {
                const newVariant = await db
                    .insert(productVariants)
                    .values({
                        color,
                        productType,
                        productID,
                    })
                    .returning()
                const product = await db.query.products.findFirst({
                    where: eq(products.id, productID)
                })
                await db.insert(variantTags).values(
                    tags.map((tag) => ({
                        tag,
                        variantID: newVariant[0].id,
                    }))
                )
                await db.insert(variantImages).values(
                    newImgs.map((img, idx) => ({
                        name: img.name,
                        size: img.size,
                        url: img.url,
                        variantID: newVariant[0].id,
                        order: idx,
                    }))
                )
                if (product) {
                    client.saveObjects({
                        indexName: "variant", // 索引名称
                        objects: [
                            {
                                objectID: newVariant[0].id.toString(),
                                id: newVariant[0].productID,
                                title: product.title,
                                price: product.price,
                                productType: newVariant[0].productType,
                                variantImages: newImgs[0].url,
                            },
                        ],
                    })
                }
                revalidatePath("/dashboard/products")
                return {
                    success: `Added ${productType}`
                }
            }
        } catch (error) {
            return { error: "Failed to create variant" }
        }
    }
    )