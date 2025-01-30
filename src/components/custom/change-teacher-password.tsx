"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import useMediaQuery from "~/hooks/use-media-query";
import useResetTeacherPassword from "~/hooks/use-reset-teacher-password";
import { ResetAccount } from "~/lib/validation/reset-account";
import { Form } from "../ui/form";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import FormField from "./form-field";
import { useAction } from "next-safe-action/hooks";
import { resetPassword } from "~/server/actions/change-password";
import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";

interface ChangeTeacherPasswordProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  userId: string;
}

export default function ChangeTeacherPassword({
  isOpen,
  setIsOpen,
  userId,
}: ChangeTeacherPasswordProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const form = useResetTeacherPassword(userId);

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const { execute, status } = useAction(resetPassword, {
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
    setIsOpen(false);
  }

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Reset Password</DrawerTitle>
          <DrawerDescription>
            Are you sure you want to reset the password of this account?
          </DrawerDescription>
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
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button
                    onClick={() => closePopup()}
                    variant="secondary"
                    disabled={status === "executing"}
                  >
                    Close
                  </Button>
                </DrawerClose>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={status === "executing"}
                >
                  Confirm
                </Button>
              </DrawerFooter>
            </form>
          </Form>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
