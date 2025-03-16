"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContactsTable } from "@/components/ContactsTable";
import { defaultColumns } from "@/components/ContactsTable";
import { type ContactSchema } from "@/schemas/Contact";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardTitle, CardHeader, CardFooter, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye } from "lucide-react";

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

const statusColumn: ColumnDef<ContactWithStatus> = {
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
        {errorMessage && (
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-destructive">Import Error</DialogTitle>
              </DialogHeader>
              <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
                {errorMessage}
              </div>
            </DialogContent>
          </Dialog>
        )}
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
    <Card className="">
      <CardHeader>
        <CardTitle>Import Contacts</CardTitle>
        <CardDescription>
          Preview the contacts you are importing before uploading, and make sure they are correct.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <ContactsTable
            data={contacts}
            columns={[...defaultColumns, statusColumn] as ColumnDef<ContactWithStatus>[]}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onUpload} disabled={isProcessing}>
          {isProcessing ? "Uploading..." : "Upload Contacts"}
        </Button>
      </CardFooter>
    </Card>
  );
}
