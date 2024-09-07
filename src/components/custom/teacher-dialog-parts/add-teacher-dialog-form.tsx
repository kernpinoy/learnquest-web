"use client";

import { Form } from "~/components/ui/form";
import FormField from "~/components/custom/form-field";
import type { AddTeacherFormType } from "~/lib/forms/add-new-teacher-form";
import { ButtonLoading } from "../loading-button";
import { Button } from "~/components/ui/button";
import { DialogClose, DialogFooter } from "~/components/ui/dialog";
import { useAddTeacherForm } from "~/hooks/use-add-teacher-form";
import { useAction } from "next-safe-action/hooks";
import { createTeacher } from "~/server/actions/create-new-teacher";
import { toast } from "sonner";
import { useRef } from "react";

export default function AddTeacherDialogForm() {
  // Form creation
  const form = useAddTeacherForm();
  const closeRef = useRef<HTMLButtonElement>(null!);

  const { execute, status } = useAction(createTeacher, {
    onSuccess({ data }) {
      if (data?.error) {
        toast.dismiss();
        toast.warning(data?.error, { duration: 2000, closeButton: false });
      }

      if (data?.success) {
        toast.dismiss();
        toast.success(data?.success, { duration: 1000, closeButton: false });
        // TODO: Decide to either close this shit, or just reset the form
        closeRef.current.click();
        form.reset();
      }
    },
    onError({ error }) {
      toast.dismiss();
      toast.error(error.serverError, { duration: 2000, closeButton: false });
    },
  });

  function onSubmit(values: AddTeacherFormType) {
    execute(values);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="firstName"
              fieldType="text"
              label="First name"
              placeholder="John"
            />

            <FormField
              control={form.control}
              name="middleName"
              fieldType="text"
              label="Middle name"
              placeholder="Schmoe"
            />

            <FormField
              control={form.control}
              name="lastName"
              fieldType="text"
              label="Last name"
              placeholder="Smith"
            />

            <FormField
              control={form.control}
              name="username"
              fieldType="text"
              label="Username"
              placeholder="username"
            />

            <FormField
              control={form.control}
              name="password"
              fieldType="password"
              label="Password"
              placeholder="******"
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              fieldType="password"
              label="Confirm password"
              placeholder="******"
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" aria-disabled={status === "executing"}>
                  Close
                </Button>
              </DialogClose>
              <ButtonLoading
                isDisabled={status === "executing"}
                textLoading="Adding teacher account..."
                textNotLoading="Add teacher account"
              />
            </DialogFooter>
          </div>
        </form>
      </Form>
    </>
  );
}
