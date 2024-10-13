"use client";

import {
  Archive,
  MoreVertical,
  KeyRound,
  Trash2,
  UserRoundPen,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ResponsiveAlertDialog } from "../ui/responsive-alert";
import ChangeTeacherPassword from "./change-teacher-password";
import ChangeTeacherUsername from "./change-teacher-username";
import ArchiveTeacherAccount from "./archive-teacher-account";
import DeleteTeacherAccount from "./delete-teacher-acount";

export default function TeacherActionsDropdown({
  userId,
  teacherId,
}: {
  userId: string;
  teacherId: string;
}) {
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isChangeUsernameOpen, setIsChangeUsernameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <ArchiveTeacherAccount
        open={isArchiveOpen}
        onOpenChange={setIsArchiveOpen}
        teacherId={teacherId}
      />
      <ChangeTeacherPassword
        isOpen={isResetPasswordOpen}
        setIsOpen={setIsResetPasswordOpen}
        userId={userId}
      />
      <ChangeTeacherUsername
        isOpen={isChangeUsernameOpen}
        setIsOpen={setIsChangeUsernameOpen}
        userId={userId}
      />
      <DeleteTeacherAccount
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        userId={userId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="right-0" variant="ghost" size="icon" asChild>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-30">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => setIsArchiveOpen(true)}
            >
              <Archive className="mr-2 h-4 w-4" />
              <span>Archive this account</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => setIsResetPasswordOpen(true)}
            >
              <KeyRound className="mr-2 h-4 w-4" />
              <span>Reset password</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => setIsChangeUsernameOpen(true)}
            >
              <UserRoundPen className="mr-2 h-4 w-4" />
              <span>Change username</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuItem
            className="hover:cursor-pointer"
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
