import { boolean, object, string, z } from "zod";

// Special characters constant for password validation
const SPECIAL_CHARS = '!@#$%^&*(),.?":{}|<>';
const specialCharsRegex = new RegExp(`[${SPECIAL_CHARS}]+`);

// Base schemas for reusable fields
const emailFieldSchema = string()
  .min(1, "Email address is required.")
  .max(100, "Email address must be less than 100 characters.")
  .email("Invalid email address.");

const passwordFieldSchema = string()
  .min(10, "Password must be at least 10 characters.")
  .max(32, "Password must be less than 32 characters.");

const strongPasswordFieldSchema = passwordFieldSchema
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must contain at least one uppercase letter.",
  })
  .refine((password) => specialCharsRegex.test(password), {
    message: `Password must contain at least one special character (${SPECIAL_CHARS}).`,
  })
  .refine((password) => /\d/.test(password), {
    message: "Password must contain at least one number.",
  });

const rePasswordFieldSchema = string().min(1, "Password confirmation is required.");

const baseItemSchema = z.object({
  title: string().min(1, "Title is required.").max(128, "Title must be less than 128 characters."),
  description: string().optional(),
  start_date: z.union([z.literal("").transform(() => null), string()]).nullish(),
  end_date: z.union([z.literal("").transform(() => null), string()]).nullish(),
  status: z.coerce.string().nullish(),
  priority: z.coerce.string().nullish(),
  assigned_to: z.array(z.number()).optional().nullable(),
});

// Exported schemas
export const emailSchema = object({
  email: emailFieldSchema,
});

export const signInFormSchema = object({
  email: emailFieldSchema,
  password: passwordFieldSchema,
});

export const signInSchema = signInFormSchema.extend({ recaptcha: string() });

export const profileSchema = object({
  first_name: string().min(1, "First name is required.").max(50, "First name must be less than 50 characters."),
  last_name: string().min(1, "Last name is required.").max(50, "Last name must be less than 50 characters."),
  email_notification: boolean().default(false),
});

export const resetPasswordSchema = object({
  new_password: strongPasswordFieldSchema,
  re_new_password: rePasswordFieldSchema,
}).refine((data) => data.new_password === data.re_new_password, {
  message: "Passwords do not match.",
  path: ["re_new_password"],
});

export const setPasswordSchema = object({
  current_password: passwordFieldSchema,
  new_password: strongPasswordFieldSchema,
  re_new_password: rePasswordFieldSchema,
}).refine((data) => data.new_password === data.re_new_password, {
  message: "Passwords do not match.",
  path: ["re_new_password"],
});

export const projectSchema = baseItemSchema.extend({
  domain: z.coerce.string().min(1, "Domain is required."),
});

export const taskSchema = baseItemSchema;
export const subtaskSchema = baseItemSchema;
