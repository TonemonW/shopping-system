import * as z from "zod";

export const ResetSchema = z.object({
    email: z.string()
        .min(1, { message: "Email is required" }) // 验证是否为空
        .email({ message: "Invalid email format" }), // 验证邮箱格式
})