"use client";

import { useState } from "react";
import { ArchiveClassroomForm } from "~/components/classroom/archive-classroom-form";
import { DeleteClassroomForm } from "~/components/classroom/delete-classroom-form";
import DeleteTeacherAccount from "~/components/custom/delete-teacher-acount";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

interface AccountManagementFormProps {
  classCode: string;
}

export default function ClassroomSettings({
  classCode,
}: AccountManagementFormProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isArchiveDialogOPen, setIsArchiveDialogOpen] = useState(false);

  return (
    <>
      <DeleteClassroomForm
        classCode={classCode}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
      <ArchiveClassroomForm
        classCode={classCode}
        isOpen={isArchiveDialogOPen}
        onOpenChange={setIsArchiveDialogOpen}
      />

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-destructive">
                Danger Zone
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Page wherein you can archive and delete your classroom. Be
                careful.
              </p>
            </div>
            <div className="flex flex-col items-start space-y-6">
              <Button
                className="w-48"
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                Delete this classroom
              </Button>
              <Button
                className="w-48"
                variant="destructive"
                onClick={() => setIsArchiveDialogOpen(true)}
              >
                Archive this classroom
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
