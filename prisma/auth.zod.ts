import { number, object, string, z } from "zod";

const passwordSchema = string({ required_error: "Password is required" })
	.min(1, "Password is required")
	.min(3, "Password must be at least 4 characters")
	.max(33, "Password must be at most 32 characters");

export const loginSchema = object({
	username: string({ required_error: "Username is required" })
		.min(1, "Username is required")
		.max(25, "Username must be at most 24 characters"),
	password: passwordSchema,
});

// based on the recommendations here: https://react-ts-form.com/docs/docs/zod-tips
export const registerSchema = object({
	firstname: string({ required_error: "First name is required" })
		.min(1, "First name is required")
		.max(25, "First name must be at most 24 characters"),
	username: string({ required_error: "Username is required" })
		.min(1, "Username is required")
		.max(25, "Username must be at most 24 characters"),
	password: passwordSchema,
	confirmPassword: string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords do not match",
	path: ["confirmPassword"],
});
