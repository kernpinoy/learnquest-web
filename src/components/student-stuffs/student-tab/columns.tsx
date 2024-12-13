"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Ellipsis, MoveDown, MoveUp, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { formatDate } from "~/lib/date-stuffs";
import { DeleteStudentForm } from "./actions-stuff/delete-student-form";

export type Student = {
  lrn: string;
  fullName: string;
  sex: string;
  createdAt: Date;
};

function StudentActionsDropdown({ lrn, fullName, sex, createdAt }: Student) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <DeleteStudentForm
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        lrn={lrn}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-ri h-8 w-8 p-0">
            <span className="sr-only">Open actions</span>
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit student info</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)} // Change here to open the dialog
            className="text-red-600 hover:cursor-pointer focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete student</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      const direction = column.getIsSorted();

      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(direction === "asc")}
        >
          Name
          {direction === "asc" ? (
            <MoveDown className="ml-2 h-4 w-4" />
          ) : (
            <MoveUp className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "lrn",
    header: () => <div className="text-left">LRN</div>,
  },
  {
    accessorKey: "sex",
    header: () => <div className="text-left">Sex</div>,
    cell: ({ row }) => {
      const val = row.getValue("sex") as string;

      return <div className="capitalize">{val}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      const direction = column.getIsSorted();

      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span>Created on</span>
          {direction === "asc" ? (
            <MoveDown className="ml-2 h-4 w-4" />
          ) : (
            <MoveUp className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const val = row.getValue("createdAt") as Date;

      return <div className="text-left">{formatDate(val)}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const val = row.original;

      return <StudentActionsDropdown {...val} />;
    },
  },
];
