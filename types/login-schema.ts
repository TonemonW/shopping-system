import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string()
        .min(1, { message: "Email is required" }) // 验证是否为空
        .email({ message: "Invalid email format" }), // 验证邮箱格式
    password: z.string()
        .min(1, { message: "Password is required" }), // 验证是否为空
    code: z.string().optional() // 可选字段
});