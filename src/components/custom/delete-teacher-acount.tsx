"use client";

import useMediaQuery from "~/hooks/use-media-query";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import FormField from "./form-field";
import { deleteTeacherAction } from "~/server/actions/delete-teacher";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import useDeleteTeacher from "~/hooks/use-delete-teacher";
import { DeleteTeacher } from "~/lib/validation/delete-teacher";

interface DeleteTeacherAccountProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  userId: string;
}

export default function DeleteTeacherAccount({
  open,
  onOpenChange,
  userId,
}: DeleteTeacherAccountProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const form = useDeleteTeacher(userId);

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const { execute, status } = useAction(deleteTeacherAction, {
    onSuccess({ data }) {
      if (data?.error) {
        toast.dismiss();
        toast.warning(data?.error, { duration: 2000, closeButton: false });
      }

      if (data?.success) {
        toast.dismiss();
        toast.success(data?.success, { duration: 1000, closeButton: false });
        form.reset();
      }
    },
    onError({ error }) {
      toast.dismiss();
      toast.error(error.serverError, { duration: 2000, closeButton: false });
    },
  });

  function onSubmit(values: DeleteTeacher) {
    execute(values);
  }

  function closePopup() {
    form.reset();
    onOpenChange(false);
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>
              This will delete the teacher account and remove it from the list
              permanently.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid items-start gap-4"
            >
              <FormField
                control={form.control}
                name="teacherId"
                fieldType="hidden"
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    onClick={() => closePopup()}
                    disabled={status === "executing"}
                  >
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
}
