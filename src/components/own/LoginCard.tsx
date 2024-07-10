"use client";

import { useFormStatus } from "react-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { PasswordInput } from "~/components/own/PasswordInput";

const loginFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be atleast 2 characters." })
    .min(1, { message: "Username cannot be empty." })
    .transform((str) => str.trim()),
  password: z
    .string()
    .min(2, { message: "Password must be atleast 2 characters." })
    .min(1, { message: "Password cannot be empty." })
    .transform((str) => str.trim()),
});

export default function LoginCard({
  className,
}: {
  className?: string | undefined;
}) {
  // We define form here
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    console.log(values);
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className={className}>
          <CardHeader>
            <CardTitle className="text-6xl">Login</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          className=""
                          aria-placeholder="Enter username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          aria-placeholder="Enter password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button>Login</Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
