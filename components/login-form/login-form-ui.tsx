"use client";

import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import {
  LoginFormSchemaType,
  resolver,
  defaultValues,
} from "~/lib/forms/login-form";
import { cn } from "~/lib/utils";
import { Form } from "~/components/ui/form";
import FormField from "~/components/custom/form-field";
import { LoadingButton } from "~/components/custom/loading-button";
import { toast } from "sonner";

interface LoginFormUIProps extends HTMLAttributes<HTMLDivElement> {}

export default function LoginFormUI({ className, ...props }: LoginFormUIProps) {
  // For button login, prevention of spam
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Form creation
  const form = useForm<LoginFormSchemaType>({
    resolver,
    defaultValues: defaultValues,
  });

  function onSubmit(values: LoginFormSchemaType) {
    const { username, password } = values;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (username === "jeanelle" && password === "toque") {
        toast.success("Logged in successfully!");
      } else {
        toast.error("Logged in failed!");
      }
    }, 3000);
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
                placeholder="username"
              />

              <FormField
                control={form.control}
                name="password"
                fieldType="password"
                label="Password"
                placeholder="********"
              />

              <LoadingButton className="mt-3" loading={isLoading}>
                Log in
              </LoadingButton>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
