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
// import DeleteClassroom from "./delete-classroom"; // Adjust the component for deleting a classroom
// import UnarchiveClassroom from "./unarchive-classroom"; // Adjust the component for unarchiving a classroom

interface ArchivedClassroomActionsDropdownProps {
  classroomId: string;
}

export default function ArchivedClassroomActionsDropdown({
  classroomId,
}: ArchivedClassroomActionsDropdownProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUnarchiveOpen, setIsUnarchiveOpen] = useState(false);

  return (
    <>
      {/* <UnarchiveClassroom
        open={isUnarchiveOpen}
        onOpenChange={setIsUnarchiveOpen}
        classroomId={classroomId}
      />
      <DeleteClassroom
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        classroomId={classroomId}
      /> */}
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
