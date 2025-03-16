export interface Contact {
  id: string
  first_name: string
  last_name: string
  email_address: {
    address: string
  }
  created_at: string
  street_addresses: {
    id: string
    createdAt: Date
    updatedAt: Date
    kind: string
    street: string
    city: string
    state: string
    postal_code: string
    country: string
  }[]
} 