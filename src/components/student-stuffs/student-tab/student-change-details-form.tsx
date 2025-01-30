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
import { useUpdateStudentForm } from "~/hooks/use-update-student-form";
import { type UpdateStudent } from "~/lib/validation/update-student-info";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { updateStudentInfoAction } from "~/server/actions/update-student-info";
import { useRouter } from "next/navigation";

type Student = {
  lrn: string;
  firstName: string;
  middleName: string;
  lastName: string;
  sex: "male" | "female";
};

interface UpdateStudentFormProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  student: Student;
}

export default function UpdateStudentForm({
  isOpen,
  onOpenChange,
  student,
}: UpdateStudentFormProps) {
  const form = useUpdateStudentForm(
    student.lrn,
    student.firstName,
    student.middleName,
    student.lastName,
    student.sex,
  );
  const { firstName, middleName, lastName, sex, lrn } = form.watch();
  const router = useRouter();

  const hasChanges = useMemo(() => {
    return (
      firstName !== student.firstName ||
      middleName !== student.middleName ||
      lastName !== student.lastName ||
      sex !== student.sex ||
      lrn !== student.lrn
    );
  }, [
    firstName,
    student.firstName,
    student.middleName,
    student.lastName,
    student.sex,
    middleName,
    lastName,
    sex,
    lrn,
    student.lrn,
  ]);

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  useEffect(() => {
    if (!isOpen) {
      form.reset({
        firstName: student.firstName,
        middleName: student.middleName,
        lastName: student.lastName,
        sex: student.sex,
        lrn: student.lrn,
      });
    }
  }, [
    isOpen,
    form,
    firstName,
    lastName,
    lrn,
    middleName,
    sex,
    student.firstName,
    student.middleName,
    student.lastName,
    student.sex,
    student.lrn,
  ]);

  const { execute, status } = useAction(updateStudentInfoAction, {
    onSuccess({ data }) {
      if (data?.error) {
        toast.dismiss();
        toast.warning(data?.error, { duration: 2000, closeButton: false });
      }

      if (data?.success) {
        toast.dismiss();
        toast.success(data?.success, { duration: 1000, closeButton: false });
        form.reset();
        onOpenChange(false);
      }
    },
    onError({ error }) {
      toast.dismiss();
      toast.error(error.serverError, { duration: 2000, closeButton: false });
    },
  });

  function onSubmit(values: UpdateStudent) {
    execute(values);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-screen lg:max-w-screen-lg">
        <DialogHeader className="pl-1">
          <DialogTitle>Update Student</DialogTitle>
          <DialogDescription>
            Modify the details of the student.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <ScrollArea className="h-96">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 items-start gap-6"
            >
              <div className="pl-1 pr-6">
                <FormField
                  control={form.control}
                  name="lrn"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} type="hidden" />
                      </FormControl>
                    </FormItem>
                  )}
                />

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

                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sex</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select sex" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Select the student&apos;s sex.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <div className="flex justify-end space-x-4 pr-6">
                  <DialogClose asChild>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                  </DialogClose>
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
              </DialogFooter>
            </form>
          </ScrollArea>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
