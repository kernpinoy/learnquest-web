import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import {
  defaultValues,
  ResetAccount,
  resolver,
} from "~/lib/validation/reset-account";
import { Form } from "../ui/form";
import FormField from "../custom/form-field";
import { ResponsiveAlertDialog } from "../ui/responsive-alert";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "../ui/button";

interface ResetPasswordFormProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  description?: string;
  confirmVariant: VariantProps<typeof buttonVariants>["variant"];
}

export default function ResetPasswordForm({
  confirmVariant,
  isOpen,
  setIsOpen,
  title,
  description,
}: ResetPasswordFormProps) {
  const form = useForm<ResetAccount>({
    resolver,
    defaultValues,
  });

  function onSubmit(values: ResetAccount) {
    console.log(values);
  }

  return (
    <>
      <ResponsiveAlertDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={title}
        description={description}
        confirmVariant={confirmVariant}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="password"
                fieldType="password"
                label="Password"
                placeholder="Enter your password"
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                fieldType="password"
                label="Confirm Password"
                placeholder="Confirm your password"
              />
            </div>
          </form>
        </Form>
      </ResponsiveAlertDialog>
    </>
  );
}
