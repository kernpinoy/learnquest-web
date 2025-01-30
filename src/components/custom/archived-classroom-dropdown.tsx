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
import { UnarchiveClassroom } from "./unarchive-classroom";
import { DeleteClassroomForm } from "../classroom/delete-classroom-form";
// import DeleteClassroom from "./delete-classroom"; // Adjust the component for deleting a classroom

interface ArchivedClassroomActionsDropdownProps {
  classroomId: string;
  classCode: string;
}

export default function ArchivedClassroomActionsDropdown({
  classroomId,
  classCode,
}: ArchivedClassroomActionsDropdownProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUnarchiveOpen, setIsUnarchiveOpen] = useState(false);

  return (
    <>
      <UnarchiveClassroom
        isOpen={isUnarchiveOpen}
        onOpenChange={setIsUnarchiveOpen}
        classroomId={classroomId}
      />
      <DeleteClassroomForm
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        classCode={classCode}
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
            <span>Delete this classroom</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
