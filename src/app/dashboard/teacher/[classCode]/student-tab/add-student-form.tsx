import { useAction } from "next-safe-action/hooks";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import FormField from "~/components/custom/form-field";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormField as Fld,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useAddStudentForm } from "~/hooks/use-add-student-form";
import type { AddStudent } from "~/lib/validation/add-student";
import { createStudentAction } from "~/server/actions/create-new-student";

interface StudentTabFormProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  classCode: string;
}

export function StudentTabForm({
  isOpen,
  setIsOpen,
  classCode,
}: StudentTabFormProps) {
  const form = useAddStudentForm({ classCode });

  const { execute, status } = useAction(createStudentAction, {
    onSuccess({ data }) {
      if (data?.error) {
        toast.dismiss();
        toast.warning(data?.error, { duration: 2000, closeButton: false });
      }

      if (data?.success) {
        toast.dismiss();
        toast.success(data?.success, { duration: 1000, closeButton: false });
        form.reset();
        close();
      }
    },
    onError({ error }) {
      toast.dismiss();
      toast.error(error.serverError, { duration: 2000, closeButton: false });
    },
  });

  function onSubmit(values: AddStudent) {
    execute(values);
  }

  function close() {
    form.reset();
    setIsOpen(false);
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add student</DialogTitle>
            <DialogDescription>
              The form to add students to your classroom.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid items-start gap-4"
            >
              <FormField
                control={form.control}
                fieldType="text"
                name="lrn"
                label="LRN"
                placeholder="123456789012"
                description="Enter the LRN of the student."
              />

              <FormField
                control={form.control}
                fieldType="text"
                name="firstName"
                label="First Name"
                placeholder="Juan"
              />

              <FormField
                control={form.control}
                fieldType="text"
                name="middleName"
                label="Middle Name"
                placeholder="Dela Cruz"
              />

              <FormField
                control={form.control}
                fieldType="text"
                name="lastName"
                label="Last Name"
                placeholder="Samson"
              />

              <Fld
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the sex of the student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                fieldType="password"
                name="password"
                label="Password"
                placeholder="******"
              />

              <FormField
                control={form.control}
                fieldType="hidden"
                name="classroomId"
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    onClick={() => close()}
                    variant="secondary"
                    // aria-disabled={status === "executing"}
                  >
                    Close
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  // aria-disabled={status === "executing"}
                >
                  Confirm
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
