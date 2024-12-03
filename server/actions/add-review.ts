"use server"
import { createSafeActionClient } from 'next-safe-action'
import { and, eq } from "drizzle-orm"
import { db } from ".."
import { products, reviews } from "../schema"
import { revalidatePath } from 'next/cache';
import { reviewSchema } from '@/types/review-schema';
import { auth } from '../auth'

const actionClient = createSafeActionClient();

export const addReview = actionClient
    .schema(reviewSchema)
    .action(async ({ parsedInput: { productID, rating, comment } }) => {
        try {
            const session = await auth()
            if (!session) return { error: "please sign in" }

            const reviewExists = await db.query.reviews.findFirst({
                where: and(
                    eq(reviews.productID, productID),
                    eq(reviews.userID, session.user.id)
                ),
            })
            if (reviewExists)
                return { error: "You have already reviewed this product" }
            const newReview = await db
                .insert(reviews)
                .values({
                    productID,
                    rating,
                    comment,
                    userID: session.user.id,
                })
                .returning()
            revalidatePath(`/products/${productID}`)
            return { success: newReview[0] }
        } catch (err) {
            return { error: JSON.stringify(err) }
        }
    }
    )