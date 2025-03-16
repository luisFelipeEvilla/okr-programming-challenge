"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Papa, { ParseError } from "papaparse";
import { Check, File } from "lucide-react";

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

export default function ImportContactsPage() {
  const router = useRouter();
  const [parseError, setParseError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [contacts, setContacts] = useState<ContactSchema[]>([]);

  const form = useForm<CSVFileSchema>({
    resolver: zodResolver(csvFileSchema),
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const onSubmit = async (data: CSVFileSchema) => {
    setIsProcessing(true);
    setParseError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result;

      if (typeof csv === "string") {
        Papa.parse<Record<string, string>>(csv, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            try {
              // Validate each row
              const contacts = results.data.map((row) => {
                return contactSchema.parse({
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
              });

              // preview the results
              setContacts(contacts);

              //   Navigate back to contacts list
              //   router.push("/contacts");
            } catch (error) {
              if (error instanceof ZodError) {
                setParseError(error.message);
              } else {
                setParseError("Failed to process CSV file.");
              }

              toast.error("Failed to process CSV file.")
            } finally {
              setIsProcessing(false);
            }
          },
          error: (error: Error) => {
            setParseError(`Failed to parse CSV file: ${error.message}`);
            setIsProcessing(false);
          },
        });
      }
    };
    reader.readAsText(data.file);
  };

  return (
    <div className="container mx-auto py-10">
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
                }}
              />
              {selectedFile && !form.formState.errors.file && (
                <FilesPreview selectedFile={selectedFile} contacts={contacts} />
              )}
            </div>
            {parseError && (
              <div className="text-sm font-medium text-destructive">
                {parseError}
              </div>
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
    </div>
  );

  function FilesPreview({
    selectedFile,
    contacts,
  }: {
    selectedFile: File;
    contacts: ContactSchema[];
  }) {
    return (
      <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
          <File className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium">{selectedFile.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(selectedFile.size)}
          </p>
        </div>
        <Check className="ml-auto h-5 w-5 text-green-500" />
      </div>
    );
  }
}
