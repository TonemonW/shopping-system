"use server"

import { createSafeActionClient } from "next-safe-action"
import * as z from 'zod'
import { db } from ".."
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { productVariants } from "../schema"

const actionClient = createSafeActionClient();
export const deleteVariant = actionClient
    .schema(z.object({ id: z.number() }))
    .action(async ({ parsedInput: { id } }) => {
        try {
            const deletedVariant = await db
                .delete(productVariants)
                .where(eq(productVariants.id, id))
                .returning()
            revalidatePath("dashboard/products")
            return { success: `Deleted ${deletedVariant[0].productType}` }
        } catch (error) {
            return { error: "Failed to delete variant" }
        }
    }
    )