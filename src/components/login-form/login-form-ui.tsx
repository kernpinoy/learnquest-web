"use client";

import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FormField from "~/components/custom/form-field";
import { ButtonLoading } from "~/components/custom/loading-button";
import { Form } from "~/components/ui/form";
import { defaultValues, resolver } from "~/lib/validation/login";
import type { LoginForm } from "~/lib/validation/login";
import { cn } from "~/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { loginAccountAction } from "~/server/actions/login-account";
import Logo from "~/components/Logo.svg";
import PEL2_logo from "~/components/PEL2_logo.svg";
import Image from "next/image";

interface LoginFormUIProps extends HTMLAttributes<HTMLDivElement> {}

export default function LoginFormUI({ className, ...props }: LoginFormUIProps) {
  const router = useRouter();

  // Form creation
  const form = useForm<LoginForm>({
    resolver,
    defaultValues: defaultValues,
  });

  const { execute, status } = useAction(loginAccountAction, {
    onSuccess({ data }) {
      if (data?.error) {
        toast.dismiss();
        toast.warning(data?.error, { duration: 2000, closeButton: false });
      }

      if (data?.success) {
        toast.dismiss();
        toast.success(data?.success, { duration: 1000, closeButton: false });
        form.reset();
        router.push(data.destination);
      }
    },
    onError({ error }) {
      toast.dismiss();
      toast.error(error.serverError, { duration: 2000, closeButton: false });
    },
  });

  function onSubmit(values: LoginForm) {
    execute(values);
  }

  return (
    <>
      <div className={cn("grid gap-6", className)} {...props}>
        <section>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight">Login</h1>
          <p className="text-sm text-muted-foreground">
            Enter your username and password below <br />
            to log into your account
          </p>
        </section>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="username"
                fieldType="text"
                label="Username"
                placeholder="shadcn"
              />

              <FormField
                control={form.control}
                name="password"
                fieldType="password"
                label="Password"
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
    </>
  );
}
