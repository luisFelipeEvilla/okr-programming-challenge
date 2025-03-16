import { Prisma } from "@prisma/client"

export type Contact = Prisma.ContactGetPayload<{
    include: {
        street_addresses: true
    }
}>