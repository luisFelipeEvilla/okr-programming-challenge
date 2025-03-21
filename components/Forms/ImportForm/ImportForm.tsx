"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
  ContactCsvSchema,
  contactSchema,
  csvFileSchema,
  type CSVFileSchema,
  type ContactSchema,
} from "@/schemas/Contact";
import { ZodError } from "zod";
import { toast } from "react-toastify";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ValidationErrors from "@/components/ValidationErrors/ValidationErrors";
import { csvToContact } from "@/adapters/csvToContact.adapter";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { readCsvFile } from "@/lib/utils";

interface ImportFormProps {
  onImport: (contacts: ContactSchema[]) => void;
}

export function ImportForm({ onImport }: ImportFormProps) {
  const router = useRouter();
  const [parseError, setParseError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<ZodError | null>(null);

  const form = useForm<CSVFileSchema>({
    resolver: zodResolver(csvFileSchema),
  });

  const handleImport = async (data: CSVFileSchema) => {
    setIsProcessing(true);
    setParseError(null);
    setValidationError(null);

    readCsvFile(data.file, handleParse, (error) => {
      setParseError(`Failed to parse CSV file: ${error.message}`);
      setIsProcessing(false);
      toast.error("Failed to parse CSV file");
    });
  };

  /**
   * Handles the parsing of the CSV file.
   * @param results - The results of the CSV file.
   */
  function handleParse(results: ArrayIterator<[number, unknown]>) {
    try {
      let contacts: ContactSchema[] = [];

      for (const [index, row] of results) {
        try {
          const contact = csvToContact(row as ContactCsvSchema);
          const parsedContact = contactSchema.parse(contact);

          contacts.push(parsedContact);
        } catch (error) {
          if (error instanceof ZodError) {
            error.errors.forEach((err) => {
              err.message = `Row ${index + 1}: ${err.message}`;
            });
            throw error;
          }
          throw error;
        }
      }

      const { duplicateEmails } = validateDuplicateEmails(contacts);

      if (!form.getValues("skipDuplicates")) {
        if (duplicateEmails.size > 0) {
          throw new ZodError([
            {
              code: "custom",
              path: ["email"],
              message: `Duplicate email addresses found: ${Array.from(
                duplicateEmails
              ).join(", ")}`,
            },
          ]);
        }
      } else {
        contacts = contacts.filter(
          (contact) => !duplicateEmails.has(contact.email_address.address)
        );
      }


      onImport(contacts);
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
  }

  function validateDuplicateEmails(contacts: ContactSchema[]) {
    const emailSet = new Set<string>();
    const duplicateEmails = new Set<string>();

    for (const contact of contacts) {
      const email = contact.email_address.address.trim();
      if (emailSet.has(email)) {
        duplicateEmails.add(email);
      } else {
        emailSet.add(email);
      }
    }

    return {
      uniqueEmails: emailSet,
      duplicateEmails: duplicateEmails,
    };
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Import Contacts</CardTitle>
        <CardDescription>
          Upload a CSV file containing your contacts. The file should include
          columns for first name, last name, and email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            role="form"
            className="space-y-4"
            onSubmit={form.handleSubmit(handleImport)}
          >
            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem className="space-y-4">
                  <FileInput
                    role="input"
                    data-testid="file-input"
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
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skipDuplicates"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <Checkbox
                    id="skipDuplicates"
                    checked={field.value}
                    onCheckedChange={(checked: boolean) => {
                      field.onChange(checked);
                    }}
                  />
                  <FormLabel htmlFor="skipDuplicates">
                    Skip duplicates
                  </FormLabel>
                </FormItem>
              )}
            />

            <ValidationErrors error={validationError} />
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
                onClick={() => router.push("/dashboard/contacts")}
                role="button"
                name="Cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isProcessing}
                name="Import Contacts"
                role="button"
              >
                {isProcessing ? "Processing..." : "Import Contacts"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
