import { z } from "zod";

export const kindSchema = z.enum(["home", "work", "other"]);

export const contactSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email_address: z.object({
    address: z.string().email("Invalid email address"),
    permission_to_send: z.string().optional(),
  }),
  street_addresses: z.optional(
    z.array(
      z.object({
        kind: kindSchema,
        street: z.string(),
        city: z.string(),
        state: z.string(),
        postal_code: z.string(),
        country: z.string(),
      })
    )
  ),
  create_source: z.literal("Account"),
  phone_numbers: z.optional(
    z.array(
      z.object({
        kind: kindSchema,
        phone_number: z.string(),
      })
    )
  ),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const contactCsvSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  address_line_1: z.string(),
  address_line_2: z.string(),
  address_city: z.string(),
  address_state: z.string(),
  address_zip: z.string(),
  address_country: z.string(),
  email: z.string().email("Invalid email address"),
  phone_number: z.string(),
});

export const csvFileSchema = z.object({
  file: z
    .custom<File>((file) => file instanceof File, "Please upload a file")
    .refine((file) => file.type === "text/csv", "File must be a CSV")
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File must be less than 5MB"
    ),
  skipDuplicates: z.boolean().default(false),
});

export type ContactSchema = z.infer<typeof contactSchema>;
export type KindSchema = z.infer<typeof kindSchema>;
export type CSVFileSchema = z.infer<typeof csvFileSchema>;
export type ContactCsvSchema = z.infer<typeof contactCsvSchema>;
