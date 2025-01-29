"use client";

import { useAction } from "next-safe-action/hooks";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "sonner";
import FormField from "~/components/custom/form-field";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Form } from "~/components/ui/form";
import useResetStudentPassword from "~/hooks/use-reset-student-password";
import { ResetAccount } from "~/lib/validation/reset-account";
import { resetPasswordStudent } from "~/server/actions/change-password-student";

interface ChangeStudentPasswordProp {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  lrn: string;
}

export function ChangeStudentPassword({
  isOpen,
  lrn,
  onOpenChange,
}: ChangeStudentPasswordProp) {
  const form = useResetStudentPassword(lrn);

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [form, isOpen]);

  const { execute, status } = useAction(resetPasswordStudent, {
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
      }
    },
    onError({ error }) {
      toast.dismiss();
      toast.error(error.serverError, { duration: 2000, closeButton: false });
    },
  });

  function onSubmit(values: ResetAccount) {
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
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Are you sure you want to reset the password of this account?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid items-start gap-4"
          >
            <div className="grid gap-2">
              <FormField
                control={form.control}
                fieldType="hidden"
                name="userId"
              />

              <FormField
                control={form.control}
                fieldType="password"
                name="password"
                label="Enter new password"
                placeholder="******"
              />

              <FormField
                control={form.control}
                fieldType="password"
                name="confirmPassword"
                label="Confirm new password"
                placeholder="******"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  onClick={() => closePopup()}
                  variant="secondary"
                  disabled={status === "executing"}
                >
                  Close
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="destructive"
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
