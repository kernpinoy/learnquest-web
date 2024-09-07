"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FormField from "~/components/custom/form-field";
import { ButtonLoading } from "~/components/custom/loading-button";
import { Form } from "~/components/ui/form";
import {
  defaultValues,
  LoginFormSchemaType,
  resolver,
} from "~/lib/forms/login-form";
import { cn } from "~/lib/utils";

interface LoginFormUIProps extends HTMLAttributes<HTMLDivElement> {}

export default function LoginFormUI({ className, ...props }: LoginFormUIProps) {
  const router = useRouter();

  // Form creation
  const form = useForm<LoginFormSchemaType>({
    resolver,
    defaultValues: defaultValues,
  });

  async function onSubmit(values: LoginFormSchemaType) {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("password", values.password);
  }

  return (
    <>
      <div className={cn("grid gap-6", className)} {...props}>
        <section>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">Login</h1>
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
