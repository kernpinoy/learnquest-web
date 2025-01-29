"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getFilteredRowModel,
  getCoreRowModel,
  getSortedRowModel,
  VisibilityState,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { useState, memo, useCallback, ChangeEvent } from "react";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { StudentTabForm } from "./add-student-form";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  classCode: string;
}

const nameMap: Record<string, string> = {
  fullName: "Name",
  lrn: "LRN",
  sex: "Sex",
  createdAt: "Created on",
};

export const DataTable = memo(function DataTable<TData, TValue>({
  columns,
  data,
  classCode,
}: DataTableProps<TData, TValue>) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const handleFilterChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      table.getColumn("lrn")?.setFilterValue(value);
    },
    [table],
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Input
            onChange={handleFilterChange}
            placeholder="Search by LRN..."
            className="w-52 lg:w-80"
            value={(table.getColumn("lrn")?.getFilterValue() as string) ?? ""}
          />

          <Button
            className="ml-auto"
            onClick={() => setIsFormOpen(!isFormOpen)}
          >
            Add Student
          </Button>
          <div className="flex items-center py-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-7">
                  Hide columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {nameMap[column.id] || column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
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
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <StudentTabForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        classCode={classCode}
      />
    </>
  );
});
