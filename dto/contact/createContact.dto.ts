import { z } from "zod";

export const kindSchema = z.enum(["home", "work", "other"]);

export const createContactSchema = z.object({
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
});

export type CreateContactSchema = z.infer<typeof createContactSchema>;
export type KindSchema = z.infer<typeof kindSchema>;
