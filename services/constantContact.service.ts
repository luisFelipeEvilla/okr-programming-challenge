import { getClientSideCookie } from "@/lib/utils";
import axios from "axios";
import { api_url, cc_access_token_cookie_name } from "@/config";
import { ContactSchema } from "@/schemas/Contact";

const { cookies } = await import("next/headers");

const client = axios.create({
  baseURL: api_url,
});

client.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const accessToken = getClientSideCookie(cc_access_token_cookie_name);
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(cc_access_token_cookie_name)?.value;
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export async function getContacts({
  cursor,
  limit,
}: {
  cursor?: string;
  limit?: string;
}): Promise<{
  contacts: ContactSchema[];
  contacts_count: number;
  _links: {
    next?: {
      href: string;
    };
  };
}> {
  const searchParams = new URLSearchParams();
  if (limit) searchParams.set("limit", limit);
  if (cursor) searchParams.set("cursor", cursor);
  searchParams.set("include", "phone_numbers,street_addresses");
  searchParams.set("include_count", "true");

  const response = await client.get(`/contacts?${searchParams.toString()}`);

  console.log(response.data);
  return response.data;
}

export async function createContact(
  contact: ContactSchema,
  abortSignal?: AbortSignal
) {
  const response = await client.post("/contacts", contact, {
    signal: abortSignal,
  });
  return response.data;
}

export async function getContact(contactId: string): Promise<ContactSchema> {
  const searchParams = new URLSearchParams();
  searchParams.set("include", "phone_numbers,street_addresses");

  const response = await client.get(`/contacts/${contactId}?${searchParams.toString()}`);
  return response.data;
}

export default client;
