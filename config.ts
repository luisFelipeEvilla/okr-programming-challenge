export const client_id = process.env.NEXT_PUBLIC_CONSTANT_CONTACT_CLIENT_ID || "d267bdf7-a2ad-4a40-bb2f-f1bbb4d16685";
export const client_secret = process.env.NEXT_PUBLIC_CONSTANT_CONTACT_CLIENT_SECRET || "L8d7evGPuWjK0JrzDGqW8w";
export const redirect_uri = process.env.NEXT_PUBLIC_CONSTANT_CONTACT_REDIRECT_URI || "http://localhost:3000/api/auth/callback/constantcontact";
export const auth_url = process.env.NEXT_PUBLIC_CONSTANT_CONTACT_AUTH_URL || "https://authz.constantcontact.com/oauth2/default/v1/authorize";
export const token_url = process.env.NEXT_PUBLIC_CONSTANT_CONTACT_TOKEN_URL || "https://authz.constantcontact.com/oauth2/default/v1/token";
export const api_url = process.env.NEXT_PUBLIC_CONSTANT_CONTACT_API_URL || "http://localhost:3000/api";

export const cc_access_token_cookie_name = "cc_access_token";