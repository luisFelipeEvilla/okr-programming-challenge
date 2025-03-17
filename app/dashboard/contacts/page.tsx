"use client";
import { ContactsTable } from "@/components/Tables/ContactsTable/ContactsTable";
import { Button } from "@/components/ui/button";
import { ContactSchema } from "@/schemas/Contact";
import { getContacts } from "@/services/constantContact.service";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PageData {
  cursor: string | null;
  contacts: ContactSchema[];
  nextCursor: string | null;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactSchema[]>([]);
  const [contactsCount, setContactsCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [cursors, setCursors] = useState<Record<number, string>>({});
  const [pageCache, setPageCache] = useState<Record<number, ContactSchema[]>>({});

  async function fetchContacts(page: number, cursor?: string) {
    try {
      setIsLoading(true);

      // Check if we have cached data for this page
      if (pageCache[page] && !cursor) {
        setContacts(pageCache[page]);
        setCurrentPage(page);
        return;
      }

      const response = await getContacts({ cursor });
      const { contacts: newContacts, contacts_count, _links } = response;

      // Update total count
      setContactsCount(contacts_count);

      // Store the next cursor if available
      if (_links.next) {
        const nextCursor = _links.next.href.split("cursor=")[1];
        setCursors(prev => ({
          ...prev,
          [page]: nextCursor
        }));
      }

      // Cache the page data
      setPageCache(prev => ({
        ...prev,
        [page]: newContacts
      }));

      // Update current page data
      setContacts(newContacts);
      setCurrentPage(page);

    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchContacts(1);
  }, []);

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1) return;

    // If going forward, we need the cursor from the current page
    if (newPage > currentPage) {
      const cursor = cursors[currentPage];
      if (!cursor) return;
      await fetchContacts(newPage, cursor);
    } 
    // If going backward and we have cached data, use it
    else if (newPage < currentPage && pageCache[newPage]) {
      setContacts(pageCache[newPage]);
      setCurrentPage(newPage);
    }
    // If going backward but no cache, start from beginning
    else if (newPage < currentPage) {
      await fetchContacts(1);
      for (let i = 2; i <= newPage; i++) {
        await fetchContacts(i, cursors[i - 1]);
      }
    }
  };

  const hasNextPage = Boolean(cursors[currentPage]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard/contacts/import">Import CSV</Link>
            </Button>
            <Button>Export CSV</Button>
          </div>
        </div>
        <ContactsTable
          data={contacts}
          count={contactsCount}
          currentPage={currentPage}
          hasNextPage={hasNextPage}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
