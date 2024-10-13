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
import useArchiveTeacher from "~/hooks/use-archive-teacher";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { ArchiveTeacher } from "~/lib/validation/archive-teacher";
import FormField from "./form-field";
import { archiveTeacherAction } from "~/server/actions/archive-teacher";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from "../ui/drawer";

interface ArchiveTeacherAccountProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  teacherId: string;
}

export default function ArchiveTeacherAccount({
  open,
  onOpenChange,
  teacherId,
}: ArchiveTeacherAccountProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const form = useArchiveTeacher(teacherId);

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const { execute, status } = useAction(archiveTeacherAction, {
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

  function onSubmit(values: ArchiveTeacher) {
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
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This will archive the teacher account and remove it from the list.
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

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This will archive the teacher account and remove it from the list.
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
              <Button
                variant="destructive"
                type="submit"
                disabled={status === "executing"}
              >
                Confirm
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
