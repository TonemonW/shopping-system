"use client"

import { useCartStore } from "@/lib/client-store";
import { AddressElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import { useState } from "react";
import { createPaymentIntent } from "@/server/actions/create-payment-intent";
import { useAction } from "next-safe-action/hooks";
import { createOrder } from "@/server/actions/create-order";
import { toast } from "sonner";

export default function PaymentForm({ totalPrice }: { totalPrice: number }) {
    const stripe = useStripe();
    const elements = useElements();
    const { cart, setCheckoutProgress, clearCart } = useCartStore();
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")


    const { execute } = useAction(createOrder, {
        onSuccess: (response) => {
            console.log(response)
            if (response.data?.error) {
                toast.error(response.data.error)
            }
            if (response.data?.success) {
                setIsLoading(false)
                toast.success(response.data?.success)
                setCheckoutProgress("confirmation-page")
                clearCart()
            }
        },
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!stripe || !elements) {
            setIsLoading(false);
            return;
        }

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setErrorMessage(submitError.message!);
            setIsLoading(false);
            return;
        }

        // Call createPaymentIntent and handle the response
        const result = await createPaymentIntent({
            amount: totalPrice * 100,
            currency: "aud",
            cart: cart.map((item) => ({
                quantity: item.variant.quantity,
                productID: item.id,
                title: item.name,
                price: item.price,
                image: item.image,
            }))
        });

        // Check if there was an error in the result
        if (!result || result.data?.error) {
            setErrorMessage(result?.data?.error || "An unknown error occurred");
            setIsLoading(false);
            return;
        }

        // If successful, handle the payment confirmation
        if (result.data?.success) {
            const { error } = await stripe.confirmPayment({
                elements,
                clientSecret: result.data.success.clientSecretID!,
                redirect: "if_required",
                confirmParams: {
                    return_url: "http://localhost:3000/success",
                    receipt_email: result.data.success.user as string,
                },
            });

            if (error) {
                setErrorMessage(error.message!);
                setIsLoading(false);
                return;
            }

            setIsLoading(false);

            // Proceed with order creation after successful payment confirmation
            execute({
                status: "pending",
                paymentIntentID: result.data.success.paymentIntentID,
                total: totalPrice,
                products: cart.map((item) => ({
                    productID: item.id,
                    variantID: item.variant.variantID,
                    quantity: item.variant.quantity,
                })),
            });
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <AddressElement options={{ mode: "shipping" }} />
            <Button className="my-4 w-full" disabled={!stripe || !elements || isLoading}>
                {isLoading ? "Processing..." : "Pay now"}
            </Button>
        </form>
    )
}