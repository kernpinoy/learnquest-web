"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import useMediaQuery from "~/hooks/use-media-query";
import useChangeTeacherUsername from "~/hooks/use-change-teacher-username";
import type { ChangeUsername } from "~/lib/validation/change-teacher-username";
import { Form } from "../ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import FormField from "./form-field";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { useAction } from "next-safe-action/hooks";
import { changeUsernameAction } from "~/server/actions/change-username";
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

interface ChangeTeacherUsernameProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  userId: string;
}

export default function ChangeTeacherUsername({
  isOpen,
  setIsOpen,
  userId,
}: ChangeTeacherUsernameProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const form = useChangeTeacherUsername(userId);

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const { execute, status } = useAction(changeUsernameAction, {
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

  function onSubmit(values: ChangeUsername) {
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
            <DialogTitle>Change username</DialogTitle>
            <DialogDescription>
              This is the form to change username
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
                  fieldType="text"
                  name="username"
                  label="Enter new username"
                  placeholder="Username"
                />

                <FormField
                  control={form.control}
                  fieldType="text"
                  name="confirmUsername"
                  label="Confirm new username"
                  placeholder="Username"
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      onClick={() => closePopup()}
                      variant="secondary"
                      aria-disabled={status === "executing"}
                    >
                      Close
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    variant="destructive"
                    aria-disabled={status === "executing"}
                  >
                    Confirm
                  </Button>
                </DialogFooter>
              </div>
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
          <DrawerTitle>Change username</DrawerTitle>
          <DrawerDescription>
            This is the form to change username
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
                  fieldType="text"
                  name="username"
                  label="Enter new username"
                  placeholder="Username"
                />

                <FormField
                  control={form.control}
                  fieldType="text"
                  name="confirmUsername"
                  label="Confirm new username"
                  placeholder="Username"
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
