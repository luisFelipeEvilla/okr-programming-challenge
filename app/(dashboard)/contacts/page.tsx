import { ContactsTable } from "@/components/ContactsTable";
import { Button } from "@/components/ui/button";
import { api_url } from "@/config";
import axios from "axios";
import { cookies } from "next/headers";
import Link from "next/link";

async function getContacts() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("cc_access_token")?.value;
    const response = await axios.get(`${api_url}/contacts`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
    return response.data.contacts;
}

export default async function ContactsPage() {
    const contacts = await getContacts();

    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" asChild>
                            <Link href="/contacts/import">Import CSV</Link>
                        </Button>
                        <Button>Export CSV</Button>
                    </div>
                </div>
                <ContactsTable data={contacts} />
            </div>
        </div>
    )
}