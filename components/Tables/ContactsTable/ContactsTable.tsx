"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContactSchema } from "@/schemas/Contact";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const defaultColumns: ColumnDef<ContactSchema>[] = [
  {
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="w-[150px]">{row.getValue("first_name")}</div>;
    },
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="w-[150px]">{row.getValue("last_name")}</div>;
    },
  },
  {
    accessorKey: "email_address.address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const email = row.original.email_address.address;
      return <div className="w-[250px] truncate">{email}</div>;
    },
  },
  {
    accessorKey: "phone_numbers",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.phone_numbers
        ?.map((phone) => phone.phone_number)
        .join(", ");
      return <div className="w-[150px] truncate">{phone}</div>;
    },
  },
  {
    accessorKey: "street_addresses",
    header: "Address",
    cell: ({ row }) => {
      const address = row.original.street_addresses
        ?.map((address) => address.street)
        .join(", ");
      return (
        <div className="w-[300px] truncate" title={address}>
          {address}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return (
        <div className="w-[180px] whitespace-nowrap">
          {date.toLocaleString()}
        </div>
      );
    },
  },
];

interface ContactsTableProps<TData> {
  data: TData[];
  columns?: ColumnDef<TData>[];
  count?: number;
  currentPage: number;
  hasNextPage: boolean;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  onPageChange: (page: number) => Promise<void>;
  isLoading?: boolean;
}

export function ContactsTable<TData>({
  data,
  columns = defaultColumns as ColumnDef<TData>[],
  count = 0,
  currentPage,
  hasNextPage,
  pageSize = 50,
  setPageSize,
  onPageChange,
  isLoading = false,
}: ContactsTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const totalPages = Math.ceil(count / pageSize);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize,
        pageIndex: currentPage - 1,
      },
    },
    manualPagination: true,
    pageCount: totalPages,
  });

  useEffect(() => {
    table.setPageIndex(currentPage - 1);
  }, [currentPage, table]);

  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* option to set page size */}
      <div className="flex items-center justify-end gap-2">
        <Label>Page Size</Label>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => setPageSize(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select page size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
            <SelectItem value="500">500</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border flex-1 overflow-hidden">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {/* loading spinner */}
                    <Loader2 className="h-12 w-12 animate-spin m-auto" color="blue" />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No contacts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground" data-testid="pagination-info">
          {count > 0 ? (
            <>
              Showing {((currentPage - 1) * pageSize) + 1}-
              {Math.min(currentPage * pageSize, count)} of {count} contact{count !== 1 ? "s" : ""}
            </>
          ) : (
            "No contacts found"
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1 text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
