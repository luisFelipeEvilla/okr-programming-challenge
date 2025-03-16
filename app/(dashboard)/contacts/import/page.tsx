"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { AlertCircle } from "lucide-react";
import FilesPreview from "@/components/FilesPreview/FilesPreview";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileInput } from "@/components/ui/file-input";
import {
  contactSchema,
  csvFileSchema,
  type CSVFileSchema,
  type ContactSchema,
} from "@/schemas/Contact";
import { ZodError } from "zod";
import { toast } from "react-toastify";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ValidationErrors from "@/components/ValidationErrors/ValidationErrors";
import { api_url } from "@/config";
import axios from "axios";
import { getClientSideCookie } from "@/lib/utils";
import { csvToContact } from "@/adapters/csvToContact.adapter";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ContactsTable } from "@/components/ContactsTable";
import { createContact } from "@/services/constantContact.service";
export default function ImportContactsPage() {
  const router = useRouter();
  const [parseError, setParseError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [contacts, setContacts] = useState<ContactSchema[]>([]);
  const [validationError, setValidationError] = useState<ZodError | null>(null);
  const form = useForm<CSVFileSchema>({
    resolver: zodResolver(csvFileSchema),
  });
  const [importedContacts, setImportedContacts] = useState<ContactSchema[]>([]);

  async function handleSubmit() {
    for (const contact of contacts) {
      try {
        const response = await createContact(contact);
        setImportedContacts((prev) => [...prev, response]);
      } catch (error) {
        console.error(error);
      }
    }
  }

  const handleParse = async (data: CSVFileSchema) => {
    setIsProcessing(true);
    setParseError(null);
    setValidationError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result;

      if (typeof csv === "string") {
        Papa.parse<Record<string, string>>(csv, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            try {
              // First pass: validate basic schema and collect emails
              const emailSet = new Set<string>();
              const duplicateEmails = new Set<string>();

              const contacts: ContactSchema[] = [];

              // Validate each row and check for duplicates
              for (const [index, row] of results.data.entries()) {
                try {
                  const contact = csvToContact(row as any);
                  const parsedContact = contactSchema.parse(contact);

                  if (emailSet.has(parsedContact.email_address.address)) {
                    if (form.getValues("skipDuplicates")) {
                      continue;
                    } else {
                      duplicateEmails.add(parsedContact.email_address.address);
                    }
                  } else {
                    emailSet.add(parsedContact.email_address.address);
                  }

                  contacts.push(parsedContact);
                } catch (error) {
                  if (error instanceof ZodError) {
                    console.log(error);
                    error.errors.forEach((err) => {
                      err.message = `Row ${index + 1}: ${err.message}`;
                    });
                    throw error;
                  }
                  throw error;
                }
              }

              // If we found duplicates, throw a validation error
              if (duplicateEmails.size > 0) {
                const error = new ZodError([
                  {
                    code: "custom",
                    path: ["email"],
                    message: `Duplicate email addresses found: ${Array.from(
                      duplicateEmails
                    ).join(", ")}`,
                  },
                ]);
                throw error;
              }

              setContacts(contacts);
              toast.success(
                `Successfully validated ${contacts.length} contacts`
              );
            } catch (error) {
              if (error instanceof ZodError) {
                setValidationError(error);
                toast.error("Some contacts have validation errors");
              } else {
                setParseError("Failed to process CSV file.");
                toast.error("Failed to process CSV file");
              }
            } finally {
              setIsProcessing(false);
            }
          },
          error: (error: Error) => {
            setParseError(`Failed to parse CSV file: ${error.message}`);
            setIsProcessing(false);
            toast.error("Failed to parse CSV file");
          },
        });
      }
    };
    reader.readAsText(data.file);
  };

  return (
    <div className="container mx-auto py-10 flex flex-col gap-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Import Contacts</CardTitle>
          <CardDescription>
            Upload a CSV file containing your contacts. The file should include
            columns for first name, last name, and email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleParse)} className="space-y-8">
            <div className="space-y-4">
              <FileInput
                accept=".csv"
                error={form.formState.errors.file?.message}
                onFileSelect={(file) => {
                  form.setValue("file", file);
                  setSelectedFile(file);
                  setValidationError(null);
                }}
              />
              {selectedFile && !form.formState.errors.file && (
                <FilesPreview selectedFile={selectedFile} />
              )}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="skipDuplicates"
                checked={form.getValues("skipDuplicates")}
                onCheckedChange={(checked: boolean) => {
                  form.setValue("skipDuplicates", checked);
                }}
              />
              <Label htmlFor="skipDuplicates">Skip duplicates</Label>
            </div>
            {validationError && <ValidationErrors error={validationError} />}
            {parseError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{parseError}</AlertDescription>
              </Alert>
            )}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/contacts")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Import Contacts"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {contacts.length > 0 && <ContactsTable data={contacts} />}

      <Button onClick={handleSubmit} disabled={isProcessing}>
        Submit
      </Button>
    </div>
  );
}
