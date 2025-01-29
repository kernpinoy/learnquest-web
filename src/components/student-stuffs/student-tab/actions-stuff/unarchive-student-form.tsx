"use client";

import { useAction } from "next-safe-action/hooks";
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
import { useUnArchiveStudentForm } from "~/hooks/use-unarchive-student-form";
import { UnarchiveStudent } from "~/lib/validation/unarchive-student";
import { unarchiveStudentAction } from "~/server/actions/unarchive-student";

interface UnarchiveStudentFormProp {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  lrn: string;
}

export function UnarchiveStudentForm({
  isOpen,
  onOpenChange,
  lrn,
}: UnarchiveStudentFormProp) {
  const form = useUnArchiveStudentForm(lrn);

  const { execute, status } = useAction(unarchiveStudentAction, {
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

  function onSubmit(values: UnarchiveStudent) {
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
            This will unarchive the student&apos;s account. It will not be
            active once more.
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
                Confirm Unarchival
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
