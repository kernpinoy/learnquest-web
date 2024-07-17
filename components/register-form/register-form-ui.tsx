"use client";

import { HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { RegisterFormSchemaType } from "~/lib/forms/register-form";
import { resolver, defaultValues } from "~/lib/forms/register-form";
import { cn } from "~/lib/utils";
import { Form } from "~/components/ui/form";
import FormField from "~/components/custom/form-field";
import { ButtonLoading } from "~/components/custom/loading-button";

interface RegisterFormUIProps extends HTMLAttributes<HTMLDivElement> {}

export default function RegisterFormUI({
  className,
  ...props
}: RegisterFormUIProps) {
  // Form creation
  const form = useForm<RegisterFormSchemaType>({
    resolver,
    defaultValues: defaultValues,
  });

  function onSubmit(values: RegisterFormSchemaType) {
    console.log(values);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <section>
        <h1 className="text-2xl font-semibold tracking-tight mb-2">Register</h1>
        <p className="text-sm text-muted-foreground">
          Create an account to manage classes.
        </p>
      </section>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="firstName"
              fieldType="text"
              label="First name"
              placeholder="Jeanelle"
            />

            <FormField
              control={form.control}
              name="middleName"
              fieldType="text"
              label="Middle name"
              placeholder="Dela Cruz"
            />

            <FormField
              control={form.control}
              name="lastName"
              fieldType="text"
              label="Last name"
              placeholder="Toque"
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

            <ButtonLoading
              className="mt-3"
              isDisabled={form.formState.isSubmitting}
              textLoading="Please wait..."
              textNotLoading="Login"
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
