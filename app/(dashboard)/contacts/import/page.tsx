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
} from "@/lib/schemas";
import { ZodError } from "zod";
import { toast } from "react-toastify";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ValidationErrors from "@/components/ValidationErrors/ValidationErrors";
import ContactsPreview from "@/components/Tables/ContactsPreview";
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

  const onSubmit = async (data: CSVFileSchema) => {
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

              // Validate each row and check for duplicates
              const contacts = results.data.map((row, index) => {
                try {
                  const contact = contactSchema.parse({
                    first_name: row["first_name"] || "",
                    last_name: row["last_name"] || "",
                    email: row["email"] || "",
                    address_line_1: row["address_line_1"] || "",
                    address_line_2: row["address_line_2"] || "",
                    address_city: row["address_city"] || "",
                    address_state: row["address_state"] || "",
                    address_zip: row["address_zip"] || "",
                    address_country: row["address_country"] || "",
                    phone_number: row["phone_number"] || "",
                  });

                  // Check for duplicate email
                  if (emailSet.has(contact.email)) {
                    duplicateEmails.add(contact.email);
                  } else {
                    emailSet.add(contact.email);
                  }

                  return contact;
                } catch (error) {
                  if (error instanceof ZodError) {
                    error.errors.forEach((err) => {
                      err.message = `Row ${index + 1}: ${err.message}`;
                    });
                    throw error;
                  }
                  throw error;
                }
              });

              // If we found duplicates, throw a validation error
            //   if (duplicateEmails.size > 0) {
            //     const error = new ZodError([
            //       {
            //         code: "custom",
            //         path: ["email"],
            //         message: `Duplicate email addresses found: ${Array.from(duplicateEmails).join(", ")}`,
            //       },
            //     ]);
            //     throw error;
            //   }

              console.log(contacts);
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

      <ContactsPreview contacts={contacts} />
    </div>
  );
}
