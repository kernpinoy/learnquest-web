"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Archive,
  ArchiveRestore,
  Ellipsis,
  LockKeyhole,
  MoveDown,
  MoveUp,
  Pencil,
  Trash2,
} from "lucide-react";
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
import { ArchiveStudentForm } from "./actions-stuff/archive-student-form";
import { UnarchiveStudentForm } from "./actions-stuff/unarchive-student-form";
import UpdateStudentForm from "./student-change-details-form";
import { ChangeStudentPassword } from "./change-student-password-form";

export type Student = {
  lrn: string;
  firstName: string;
  middleName: string;
  lastName: string;
  sex: "male" | "female";
  fullName: string;
  createdAt: Date;
  archived: boolean;
};

function StudentActionsDropdown(student: Student) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [isUnarchived, setIsUnarchived] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPassOpen, setIsPassOpen] = useState(false);

  return (
    <>
      <DeleteStudentForm
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        lrn={student.lrn}
      />

      <ArchiveStudentForm
        isOpen={isArchived}
        onOpenChange={setIsArchived}
        lrn={student.lrn}
      />

      <UnarchiveStudentForm
        isOpen={isUnarchived}
        onOpenChange={setIsUnarchived}
        lrn={student.lrn}
      />

      <UpdateStudentForm
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        student={{
          firstName: student.firstName,
          lastName: student.lastName,
          lrn: student.lrn,
          middleName: student.middleName,
          sex: student.sex,
        }}
      />

      <ChangeStudentPassword
        isOpen={isPassOpen}
        onOpenChange={setIsPassOpen}
        lrn={student.lrn}
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
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => setIsEditOpen(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit student info</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => setIsPassOpen(true)}
          >
            <LockKeyhole className="mr-2 h-4 w-4" />
            <span>Change password</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)} // Change here to open the dialog
            className="text-red-600 hover:cursor-pointer focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete student</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              student.archived ? setIsUnarchived(true) : setIsArchived(true)
            }
            className={
              student.archived
                ? "text-green-600 hover:cursor-pointer focus:text-green-600"
                : "text-red-600 hover:cursor-pointer focus:text-red-600"
            }
          >
            {student.archived ? (
              <>
                <ArchiveRestore className="mr-2 h-4 w-4" />
                <span>Unarchive Student</span>
              </>
            ) : (
              <>
                <Archive className="mr-2 h-4 w-4" />
                <span>Archive Student</span>
              </>
            )}
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
    accessorKey: "archived",
    header: ({ column }) => {
      const direction = column.getIsSorted();

      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(direction === "asc")}
        >
          Archived
          {direction === "asc" ? (
            <MoveDown className="ml-2 h-4 w-4" />
          ) : (
            <MoveUp className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const val = row.getValue("archived") as boolean;

      return <div className="text-left">{val ? "Yes" : "No"}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const val = row.original;

      return <StudentActionsDropdown key={val.lrn} {...val} />;
    },
  },
];
