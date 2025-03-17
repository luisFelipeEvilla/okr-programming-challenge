"use client";

import { useState, useRef } from "react";
import { ImportForm } from "@/components/Forms/ImportForm/ImportForm";
import { ImportTable } from "@/components/Tables/ImportTable/ImportTable";
import { ProgressModal } from "@/components/ProgressModal/ProgressModal";
import { type ContactSchema } from "@/schemas/Contact";
import { createContact } from "@/services/api.service";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

type ContactStatus = "pending" | "success" | "error";

interface ContactWithStatus extends ContactSchema {
  status: ContactStatus;
  errorMessage?: string;
}

export default function ImportContactsPage() {
  const [contacts, setContacts] = useState<ContactWithStatus[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failureCount, setFailureCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleImport = (parsedContacts: ContactSchema[]) => {
    const contactsWithStatus = parsedContacts.map((contact) => ({
      ...contact,
      status: "pending" as const,
    }));
    setContacts(contactsWithStatus);
  };

  const handleCancel = async () => {
    if (!abortControllerRef.current) return;
    setIsCanceling(true);
    abortControllerRef.current.abort();
    toast.info("Import process canceled");
  };

  const handleUpload = async () => {
    setIsProcessing(true);
    setProgress(0);
    setSuccessCount(0);
    setFailureCount(0);
    abortControllerRef.current = new AbortController();

    for (let i = 0; i < contacts.length; i++) {
      try {
        if (abortControllerRef.current.signal.aborted) {
          setContacts((prev) => {
            const updated = [...prev];
            // Mark remaining contacts as pending
            for (let j = i; j < updated.length; j++) {
              updated[j] = { ...updated[j], status: "pending" };
            }
            return updated;
          });
          break;
        }

        await createContact({
          first_name: contacts[i].first_name,
          last_name: contacts[i].last_name,
          email_address: contacts[i].email_address,
          create_source: "Account",
          street_addresses: contacts[i].street_addresses,
          phone_numbers: contacts[i].phone_numbers,
        }, abortControllerRef.current.signal);
        setContacts((prev) => {
          const updated = [...prev];
          updated[i] = { ...updated[i], status: "success" };
          return updated;
        });
        setSuccessCount(prev => prev + 1);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          break;
        }

        let message = "Failed to upload contact";
        if (error instanceof AxiosError) {
          const data = error.response?.data;
          if (data instanceof Array) {
            const { error_message } = data[0];
            message = error_message;
          }
        } else if (error instanceof Error) {
          message = error.message;
        }

        setContacts((prev) => {
          const updated = [...prev];
          updated[i] = {
            ...updated[i],
            status: "error",
            errorMessage: message,
          };
          return updated;
        });
        setFailureCount(prev => prev + 1);
      }
      setProgress(i + 1);
    }

    setIsProcessing(false);
    setIsCanceling(false);
    abortControllerRef.current = null;
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
        successCount={successCount}
        failureCount={failureCount}
        onCancel={handleCancel}
        isCanceling={isCanceling}
      />
    </div>
  );
}
