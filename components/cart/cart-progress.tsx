"use client";
import { motion } from "framer-motion";  // 确保使用正确的模块
import { useCartStore } from "@/lib/client-store";
import { Check, CreditCard, ShoppingCart } from "lucide-react";

export default function CartProgress() {
    const { checkoutProgress } = useCartStore();

    // 定义进度条的宽度和图标显示逻辑
    const progressWidth = checkoutProgress === "cart-page"
        ? "0%"
        : checkoutProgress === "payment-page"
            ? "50%"
            : "100%";

    const isCartPage = checkoutProgress === "cart-page";
    const isPaymentPage = checkoutProgress === "payment-page";
    const isConfirmationPage = checkoutProgress === "confirmation-page";

    return (
        <div className="flex items-center justify-center ">
            <div className="w-64 h-3 bg-muted rounded-md relative">
                <div className="absolute top-0 left-0 h-full w-full flex items-center justify-between">
                    <motion.span
                        className="absolute bg-primary left-0 top-0 z-30 ease-in-out h-full flex items-center w-full" // Use flex and set width to full
                        initial={{ width: 0 }}
                        animate={{
                            width:
                                checkoutProgress === "cart-page" ? 0 :
                                    checkoutProgress === "payment-page" ? "50%" : "100%"
                        }} >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-primary rounded-full z-50 p-2 w-8 h-8
                            absolute -left-5" // Ensure size and center alignment
                        >
                            <ShoppingCart className="text-white" size={14} />
                        </motion.div>

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: checkoutProgress === 'payment-page' ? 1 : 0 || checkoutProgress === "confirmation-page" ? 1 : 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-primary rounded-full z-50 p-2 w-8 h-8 absolute -right-5" // Ensure size and center alignment
                        >
                            <CreditCard className="text-white" size={14} />
                        </motion.div>

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: checkoutProgress === "confirmation-page" ? 1 : 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-primary rounded-full z-50 p-2 w-8 h-8 absolute -right-5" // Ensure size and center alignment
                        >
                            <Check className="text-white" size={14} />
                        </motion.div>
                    </motion.span>

                </div>
            </div>
        </div>
    );
}
