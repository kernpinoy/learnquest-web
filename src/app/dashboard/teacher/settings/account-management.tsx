"use client";

import { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import DeleteTeacherAccount from "~/components/custom/delete-teacher-acount";

interface AccountManagementFormProps {
  userId: string;
}

export default function AccountManagementForm({ userId }: AccountManagementFormProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Once you delete your account, there is no going back. Please be certain.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete Account
          </Button>
        </div>
      </CardContent>

      <DeleteTeacherAccount
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        userId={userId}
      />
    </Card>
  );
}