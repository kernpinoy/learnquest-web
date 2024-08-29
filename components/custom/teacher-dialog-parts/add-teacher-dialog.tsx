import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "../../ui/button";
import { CircleCheckBig } from "lucide-react";
import AddTeacherDialogForm from "./add-teacher-dialog-form";

export default function AddTeacherDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Teacher</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <div className="grid grid-cols-2 gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <h2 className="text-xl font-semibold leading-none tracking-tight">
              Instructions
            </h2>
            {/** Left side content */}
            <div className="flex items-center space-x-2">
              <CircleCheckBig className="h-6 w-6 text-green-500" />
              <p className="text-md text-muted-foreground">
                Enter first, middle and last name in the designated fields.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <CircleCheckBig className="h-6 w-6 text-green-500 flex-none" />
              <p className="text-md text-muted-foreground">
                Enter desired username in the designated field. If the username
                is already taken, you may be prompted to choose another one.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <CircleCheckBig className="h-6 w-6 text-green-500 flex-none" />
              <p className="text-md text-muted-foreground">
                Create a secure password and enter it in the password field.
                Follow any password requirements (e.g., minimum length, special
                characters).
              </p>
            </div>
          </div>
          {/** Right side content */}
          <div className="space-y-4">
            <AddTeacherDialogForm />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
