import * as z from "zod";

export const RegisterSchema = z.object({
    email: z.string()
        .min(1, { message: "Email is required" }) // 验证是否为空
        .email({ message: "Invalid email format" }), // 验证邮箱格式
    password: z.string()
        .min(8, { message: "Password msut be at least 8 characters long" }), // 验证是否为空
    name: z.string().min(4, { message: "Please add a name with at least 4 characters" })
});