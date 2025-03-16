import { z } from "zod"

export const contactSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  address_line_1: z.string().optional(),
  address_line_2: z.string().optional(),
  address_city: z.string().optional(),
  address_state: z.string().optional(),
  address_zip: z.string().optional(),
  address_country: z.string().optional(),
  phone_number: z.string().optional(),
})

export const csvFileSchema = z.object({
  file: z
    .custom<File>((file) => file instanceof File, "Please upload a file")
    .refine((file) => file.type === "text/csv", "File must be a CSV")
    .refine((file) => file.size <= 5 * 1024 * 1024, "File must be less than 5MB"),
})

export type ContactSchema = z.infer<typeof contactSchema>
export type CSVFileSchema = z.infer<typeof csvFileSchema> 