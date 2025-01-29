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
import { useDeleteStudentForm } from "~/hooks/use-delete-student-form";
import { DeleteStudent } from "~/lib/validation/delete-student";
import { deleteStudentAction } from "~/server/actions/delete-student";

interface DeleteStudentFormProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  lrn: string;
}

export function DeleteStudentForm({
  isOpen,
  onOpenChange,
  lrn,
}: DeleteStudentFormProps) {
  const form = useDeleteStudentForm(lrn);
  const router = useRouter();

  const { execute, status } = useAction(deleteStudentAction, {
    onSuccess({ data }) {
      // if (data?.error) {
      //   toast.dismiss();
      //   toast.warning(data?.error, { duration: 2000, closeButton: false });
      // }

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

  function onSubmit(values: DeleteStudent) {
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
            This will delete the student&apos;s account and remove it from the
            list.
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
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
