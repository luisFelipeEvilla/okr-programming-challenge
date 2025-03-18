"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContactsTable } from "@/components/Tables/ContactsTable/ContactsTable";
import { defaultColumns } from "@/components/Tables/ContactsTable/ContactsTable";
import { type ContactSchema } from "@/schemas/Contact";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardTitle, CardHeader, CardFooter, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { useState } from "react";

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
                role="button"
                aria-label="view error"
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.ceil(contacts.length / pageSize);

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Calculate the current page data
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = contacts.slice(startIndex, endIndex);

  return (
    <Card className="mx-auto">
      <CardHeader>
        <CardTitle>Import Contacts</CardTitle>
        <CardDescription>
          Preview the contacts you are importing before uploading, and make sure they are correct.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <ContactsTable
            data={currentPageData}
            columns={[...defaultColumns, statusColumn] as ColumnDef<ContactWithStatus>[]}
            count={contacts.length}
            currentPage={currentPage}
            hasNextPage={currentPage < totalPages}
            pageSize={pageSize}
            setPageSize={handlePageSizeChange}
            onPageChange={handlePageChange}
            isLoading={isProcessing}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button role="button" onClick={onUpload} disabled={isProcessing}>
          {isProcessing ? "Uploading..." : "Upload Contacts"}
        </Button>
      </CardFooter>
    </Card>
  );
}
