"use client";

import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { useRef } from "react";
import { useAddClassroomForm } from "~/hooks/use-add-classroom-form";
import { AddClassroom } from "~/lib/validation/add-classroom";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { createClassroom } from "~/server/actions/create-classroom";

export default function AddClassroomDialog({ userId }: { userId: string }) {
  const form = useAddClassroomForm(userId);
  const closeRef = useRef<HTMLButtonElement>(null!);

  const { execute, status } = useAction(createClassroom, {
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

  function onSubmit(values: AddClassroom) {
    console.log(values);
    execute(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Classroom Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name of classroom" {...field} />
                </FormControl>
                <FormDescription>
                  This will be the name of the classroom.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="classSession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Session</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a session for your class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="morning">Morning Session</SelectItem>
                    <SelectItem value="afternoon">Aftenoon Session</SelectItem>
                  </SelectContent>
                  <FormDescription>
                    This will be the session of the class.
                  </FormDescription>
                  <FormMessage />
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxStudents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of students</FormLabel>
                <FormControl>
                  <Select
                    value={String(field.value)} // Ensure we pass the value as a string for select
                    onValueChange={(value) => field.onChange(Number(value))} // Convert string value to number
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select max number of students" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* You can customize the range of student numbers as needed */}
                      {[...Array(100).keys()].map((n) => (
                        <SelectItem key={n + 1} value={String(n + 1)}>
                          {n + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  This will set the maximum number of allowed students in the
                  classroom.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="schoolYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School Year</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Example: 2011 - 2012 or 2011-2012"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This sets the classroom&apos;s school year.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => <Input type="hidden" {...field} />}
          />

          <Button
            ref={closeRef}
            type="submit"
            aria-disabled={status === "executing"}
          >
            Add Classroom
          </Button>
        </div>
      </form>
    </Form>
  );
}
