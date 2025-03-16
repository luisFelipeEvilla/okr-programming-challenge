import { getClientSideCookie } from "@/lib/utils";
import axios from "axios";
import { api_url } from "@/config";
import { ContactSchema } from "@/schemas/Contact";

const { cookies } = await import('next/headers');

const client = axios.create({
  baseURL: api_url,
});


client.interceptors.request.use(async (config) => {
    if (typeof window !== "undefined") {
        const accessToken = getClientSideCookie("cc_access_token");
        config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("cc_access_token")?.value;
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});


export async function getContacts() {
    const response = await client.get("/contacts");
    return response.data.contacts;
}

export async function createContact(contact: ContactSchema) {
    const response = await client.post("/contacts", contact);
    return response.data;
}

export default client;
