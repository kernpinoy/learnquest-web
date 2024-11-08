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
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "../ui/drawer";
import { unarchiveTeacherAction } from "~/server/actions/unarchive-teacher";
import useUnarchiveTeacher from "~/hooks/use-unarchive-teacher";
import { UnarchiveTeacher } from "~/lib/validation/unarchive-teacher";
import { usePathname } from "next/navigation";

interface UnarchiveTeacherAccountProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  teacherId: string;
}

export default function UnarchiveTeacherAccount({
  open,
  onOpenChange,
  teacherId,
}: UnarchiveTeacherAccountProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const form = useUnarchiveTeacher(teacherId);

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const { execute, status } = useAction(unarchiveTeacherAction, {
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

  function onSubmit(values: UnarchiveTeacher) {
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
            <DialogTitle>Unarchive Teacher Account</DialogTitle>
            <DialogDescription>
              This will restore the teacher account and make it active again.
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
                <Button type="submit" disabled={status === "executing"}>
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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Unarchive Teacher Account</DrawerTitle>
          <DrawerDescription>
            This will restore the teacher account and make it active again.
          </DrawerDescription>
        </DrawerHeader>
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

            <DrawerFooter>
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  onClick={() => closePopup()}
                  disabled={status === "executing"}
                >
                  Cancel
                </Button>
              </DrawerClose>
              <Button type="submit" disabled={status === "executing"}>
                Confirm
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
