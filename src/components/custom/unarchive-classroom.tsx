import { Dispatch, SetStateAction, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Form } from "../ui/form";
import FormField from "./form-field";
import { Button } from "../ui/button";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import useUnarchiveClassroom from "~/hooks/use-unarchive-classroom";
import { UnarchiveClassroom as UnarchiveClassroomType } from "~/lib/validation/unarchive-classroom";
import { unarchiveClassroomAction } from "~/server/actions/unarchive-classroom";

interface UnarchiveClassroomProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  classroomId: string;
}

export function UnarchiveClassroom({
  isOpen,
  onOpenChange,
  classroomId,
}: UnarchiveClassroomProps) {
  const form = useUnarchiveClassroom(classroomId);

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [isOpen, form]);

  const { execute, status } = useAction(unarchiveClassroomAction, {
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

  function onSubmit(values: UnarchiveClassroomType) {
    execute(values);
  }

  function closePopup() {
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unarchive Classroom</DialogTitle>
          <DialogDescription>
            This will restore the classroom and its student.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid items-start gap-4"
          >
            <FormField
              control={form.control}
              name="classroomId"
              fieldType="hidden"
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => closePopup()}
                  disabled={status === "executing"}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={status === "executing"}>
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
