import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "../../ui/button";
import AddClassroomDialogForm from "./add-classroom-dialog-form";

export default function AddClassroomDialog() {
  return (
    <Dialog onOpenChange={() => {}}>
      <DialogTrigger asChild>
        <Button>Add Classroom</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <div className="space-y-4">
          <AddClassroomDialogForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
