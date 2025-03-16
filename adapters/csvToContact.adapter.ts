import { kindSchema, ContactSchema, ContactCsvSchema } from "@/schemas/Contact";


export function csvToContact(csv: ContactCsvSchema): ContactSchema {
    return {

        email_address: {
            address: csv.email,
            permission_to_send: "implicit",
        },
        create_source: "Account",
        first_name: csv.first_name,
        last_name: csv.last_name,
        street_addresses: [
            {
                kind: kindSchema.parse("home"),
                street: csv.address_line_1,
                city: csv.address_city,
                state: csv.address_state,
                postal_code: csv.address_zip,
                country: csv.address_country,
            }
        ],
        phone_numbers: [
            {
                kind: kindSchema.parse("home"),
                phone_number: csv.phone_number,
            }
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }
}