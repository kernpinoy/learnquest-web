"use client";

import {
  Archive,
  MoreVertical,
  KeyRound,
  Trash2,
  UserRoundPen,
} from "lucide-react";
import { useRef, useState } from "react";
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
import { Input } from "../ui/input";
import ResetPasswordForm from "../reset-password/reset-form";

export default function TeacherActionsDropdown() {
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isChangeUsernameOpen, setIsChangeUsernameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const resetFormRef = useRef<HTMLFormElement>(null!);
  function handleResetPassword() {
    resetFormRef.current.submit();
  }

  return (
    <>
      <ResponsiveAlertDialog
        isOpen={isArchiveOpen}
        setIsOpen={setIsArchiveOpen}
        title="Are you absolutely sure?"
        description="This will archive the teacher account and remove it from the list."
        confirmVariant="destructive"
      />
      <ResetPasswordForm
        isOpen={isResetPasswordOpen}
        setIsOpen={setIsResetPasswordOpen}
        title="Reset Password"
        description="Are you sure you want to reset the password of this account?"
        confirmVariant="destructive"
      />
      <ResponsiveAlertDialog
        isOpen={isChangeUsernameOpen}
        setIsOpen={setIsChangeUsernameOpen}
        title="Change username"
        description="Enter new username"
        confirmVariant="destructive"
      >
        <div className="grid gap-4">
          <Input type="text" placeholder="Enter username" />
        </div>
      </ResponsiveAlertDialog>
      <ResponsiveAlertDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Delete account"
        description="Do you want to delete the account"
        confirmVariant="destructive"
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
