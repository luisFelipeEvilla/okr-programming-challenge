"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContactsTable } from "@/components/ContactsTable";
import { defaultColumns } from "@/components/ContactsTable";
import { type ContactSchema } from "@/schemas/Contact";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardTitle, CardHeader, CardFooter } from "@/components/ui/card";

type ContactStatus = "pending" | "success" | "error";

interface ContactWithStatus extends ContactSchema {
  status: ContactStatus;
  errorMessage?: string;
}

interface ImportTableProps {
  contacts: ContactWithStatus[];
  onUpload: () => void;
  isProcessing: boolean;
}

const statusColumn: ColumnDef<
  ContactSchema & { status: ContactStatus; errorMessage?: string }
> = {
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => {
    const status = row.getValue("status") as ContactStatus;
    const errorMessage = row.original.errorMessage;

    return (
      <div className="flex items-center gap-2">
        <Badge
          variant={
            status === "success"
              ? "success"
              : status === "error"
              ? "destructive"
              : "secondary"
          }
        >
          {status === "success"
            ? "Imported"
            : status === "error"
            ? "Failed"
            : "Pending"}
        </Badge>
        {/* {errorMessage && (
          <span className="text-sm text-red-600 truncate max-w-[200px]" title={errorMessage}>
            {errorMessage}
          </span>
        )} */}
           <span className="text-sm text-red-600 truncate max-w-[200px]" title={errorMessage}>
            {'request failed with status 400'}
          </span>
      </div>
    );
  },
};

export function ImportTable({
  contacts,
  onUpload,
  isProcessing,
}: ImportTableProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import Contacts</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        <div className="min-w-[800px]">
          <ContactsTable
            data={contacts}
            columns={
              [...defaultColumns, statusColumn] as ColumnDef<ContactSchema>[]
            }
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onUpload} disabled={isProcessing} size="lg">
          Upload Contacts
        </Button>
      </CardFooter>
    </Card>
  );
}
