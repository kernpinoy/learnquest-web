"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import useUpdateTeacherInfoForm from "~/hooks/use-update-teacher-info-form";
import { type UpdateTeacherInfo } from "~/lib/validation/update-teacher-info";
import { Card, CardContent } from "~/components/ui/card";
import { useAction } from "next-safe-action/hooks";
import { updateTeacherInfo } from "~/server/actions/update-teacher";
import { toast } from "sonner";
import { useMemo } from "react";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "~/components/ui/input";

interface PersonalInfoFormProps {
  teacherInfo: UpdateTeacherInfo;
}

export default function PersonalInfoForm({
  teacherInfo,
}: PersonalInfoFormProps) {
  const form = useUpdateTeacherInfoForm(teacherInfo);
  const { firstName, middleName, lastName } = form.watch();

  const hasChanges = useMemo(() => {
    return (
      firstName !== teacherInfo.firstName ||
      middleName !== teacherInfo.middleName ||
      lastName !== teacherInfo.lastName
    );
  }, [firstName, middleName, lastName, teacherInfo]);

  const { execute, status } = useAction(updateTeacherInfo, {
    onSuccess({ data }) {
      if (data?.error) {
        toast.dismiss();
        toast.warning(data?.error, { duration: 2000, closeButton: false });
      }

      if (data?.success) {
        toast.dismiss();
        toast.success(data?.success, { duration: 1000, closeButton: false });
      }
    },
    onError({ error }) {
      toast.dismiss();
      toast.error(error.serverError, { duration: 2000, closeButton: false });
    },
  });

  function onSubmit(values: UpdateTeacherInfo) {
    console.log(values);
    execute(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Your legal first name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Your middle name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Your legal last name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                disabled={status === "executing" || !hasChanges}
                type="submit"
              >
                {status === "executing" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving changes...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
