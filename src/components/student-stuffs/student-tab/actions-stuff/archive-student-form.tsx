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
import { useArchiveStudentForm } from "~/hooks/use-archive-student-form";
import { ArchiveStudent } from "~/lib/validation/archive-student";
import { archiveStudentAction } from "~/server/actions/archive-student";

interface ArchiveStudentFormProp {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  lrn: string;
}

export function ArchiveStudentForm({
  isOpen,
  onOpenChange,
  lrn,
}: ArchiveStudentFormProp) {
  const form = useArchiveStudentForm(lrn);

  const { execute, status } = useAction(archiveStudentAction, {
    onSuccess({ data }) {
      if (data?.success) {
        toast.dismiss();
        toast.success(data?.success, { duration: 1000, closeButton: false });
        form.reset();
        closePopup();
      }
    },
    onError({ error }) {
      toast.dismiss();
      toast.error(error.serverError, { duration: 2000, closeButton: false });
    },
  });

  useEffect(() => {
    form.reset({ studentId: lrn });
  }, [lrn, form]);

  function onSubmit(values: ArchiveStudent) {
    console.log(values);
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
            This will archive the student&apos;s account. It will not be active
            anymore.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              fieldType="hidden"
              name="studentId"
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" type="submit">
                Confirm Archive
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
