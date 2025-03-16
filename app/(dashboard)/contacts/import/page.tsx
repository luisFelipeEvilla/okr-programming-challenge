"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImportForm } from "@/components/ImportForm/ImportForm";
import { ImportTable } from "@/components/Tables/ImportTable/ImportTable";
import { ProgressModal } from "@/components/ProgressModal/ProgressModal";
import { type ContactSchema } from "@/schemas/Contact";
import { createContact } from "@/services/constantContact.service";

type ContactStatus = 'pending' | 'success' | 'error';

interface ContactWithStatus extends ContactSchema {
  status: ContactStatus;
  errorMessage?: string;
}

export default function ImportContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactWithStatus[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImport = (parsedContacts: ContactSchema[]) => {
    const contactsWithStatus = parsedContacts.map(contact => ({
      ...contact,
      status: 'pending' as const
    }));
    setContacts(contactsWithStatus);
  };

  const handleUpload = async () => {
    setIsProcessing(true);
    setProgress(0);

    for (let i = 0; i < contacts.length; i++) {
      try {
        await createContact(contacts[i]);
        setContacts(prev => {
          const updated = [...prev];
          updated[i] = { ...updated[i], status: 'success' };
          return updated;
        });
      } catch (error) {
        setContacts(prev => {
          const updated = [...prev];
          updated[i] = { 
            ...updated[i], 
            status: 'error',
            errorMessage: error instanceof Error ? error.message : 'Failed to upload contact'
          };
          return updated;
        });
      }
      setProgress(i + 1);
    }

    setIsProcessing(false);
  };

  return (
    <div className="container py-6 space-y-6">
      <ImportForm onImport={handleImport} />
      
      {contacts.length > 0 && (
        <ImportTable
          contacts={contacts}
          onUpload={handleUpload}
          isProcessing={isProcessing}
        />
      )}

      <ProgressModal
        isOpen={isProcessing}
        progress={progress}
        total={contacts.length}
      />
    </div>
  );
}
