"use client";

import { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import ChangeTeacherUsername from "~/components/custom/change-teacher-username";
import ChangeTeacherPassword from "~/components/custom/change-teacher-password";

interface UserInfoFormProps {
  userId: string;
}

export default function UserInfoForm({ userId }: UserInfoFormProps) {
  const [isUsernameDialogOpen, setIsUsernameDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="grid gap-4">
          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-medium">Username Settings</h3>
            <p className="text-sm text-muted-foreground">
              Change your username. Choose something memorable and unique.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsUsernameDialogOpen(true)}
            >
              Change Username
            </Button>
          </div>

          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-medium">Password Settings</h3>
            <p className="text-sm text-muted-foreground">
              Update your password to keep your account secure.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsPasswordDialogOpen(true)}
            >
              Change Password
            </Button>
          </div>
        </div>
      </CardContent>

      <ChangeTeacherUsername
        isOpen={isUsernameDialogOpen}
        setIsOpen={setIsUsernameDialogOpen}
        userId={userId}
      />

      <ChangeTeacherPassword
        isOpen={isPasswordDialogOpen}
        setIsOpen={setIsPasswordDialogOpen}
        userId={userId}
      />
    </Card>
  );
}
