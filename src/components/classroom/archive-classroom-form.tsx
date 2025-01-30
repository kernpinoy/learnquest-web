"use client";

import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import FormField from "~/components/custom/form-field";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import { Form } from "~/components/ui/form";
import { useArchiveClassroomForm } from "~/hooks/use-archive-classroom-form";
import { type ArchiveClassroom } from "~/lib/validation/archive-classroom";
import { archiveClassroomAction } from "~/server/actions/archive-classroom";

interface ArchiveClassroomFormProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  classCode: string;
}

export function ArchiveClassroomForm({
  isOpen,
  onOpenChange,
  classCode,
}: ArchiveClassroomFormProps) {
  const form = useArchiveClassroomForm(classCode);
  const router = useRouter();

  const { execute, status } = useAction(archiveClassroomAction, {
    onSuccess({ data }) {
      if (data?.error) {
        toast.dismiss();
        toast.warning(data?.error, { duration: 2000, closeButton: false });
      }

      if (data?.success) {
        toast.dismiss();
        toast.success(data?.success, { duration: 1000, closeButton: false });
        form.reset();
        closePopup();
        router.push(data.nextPath);
      }
    },
    onError({ error }) {
      toast.dismiss();
      toast.error(error.serverError, { duration: 2000, closeButton: false });
    },
  });

  useEffect(() => {
    form.reset({ classCode: classCode });
  }, [classCode, form]);

  function onSubmit(values: ArchiveClassroom) {
    execute(values);
  }

  function closePopup() {
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This will archive the classroom and the students.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              fieldType="hidden"
              name="classCode"
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={status === "executing"}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                type="submit"
                disabled={status === "executing"}
              >
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
