import { db } from "@/server"
import Review from "./review"
import ReviewsForm from "./reviews-form"
import { desc, eq } from "drizzle-orm"
import { reviews } from "@/server/schema"
import Reviewchart from "./review-chart"
export default async function Reviews({ productID }: {
    productID:
    number
}) {
    const data = await db.query.reviews.findMany({
        with: { user: true },
        where: eq(reviews.productID, productID),
        orderBy: [desc(reviews.created)],
    })
    return (
        <section className="py-4">
            <div className="flex gap-2 lg:gap-12 justify-stretch
1g:flex-row flex-col">
                <div className="flex-1 ">
                    <h2 className="text-2xl font-bold my-4">Product Reviews</h2>
                    <Review reviews={data} />
                    <ReviewsForm />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                    <Reviewchart reviews={data} />
                </div>
            </div>
        </section>
    )
}