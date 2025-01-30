"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { ArchiveRestore, Trash2, MoreVertical } from "lucide-react";
import { useState } from "react";
import DeleteTeacherAccount from "./delete-teacher-acount";
import UnarchiveTeacherAccount from "./unarchive-teacher-account";

interface ArchivedTeacherActionsDropdownProps {
  userId: string;
  teacherId: string;
}

export default function ArchivedTeacherActionsDropdown({
  userId,
  teacherId,
}: ArchivedTeacherActionsDropdownProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUnarchiveOpen, setIsUnarchiveOpen] = useState(false);

  return (
    <>
      <UnarchiveTeacherAccount
        open={isUnarchiveOpen}
        onOpenChange={setIsUnarchiveOpen}
        teacherId={teacherId}
      />
      <DeleteTeacherAccount
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        userId={userId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsUnarchiveOpen(true)}>
            <ArchiveRestore className="mr-2 h-4 w-4" />
            Unarchive
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600 hover:cursor-pointer focus:text-red-600"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete this account</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
