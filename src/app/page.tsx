import { Command } from "lucide-react";
import { redirect } from "next/navigation";
import LoginFormUI from "~/components/login-form/login-form-ui";
import { validateRequest } from "~/lib/validate-request";

export default async function SignIn() {
  const { session, user } = await validateRequest();

  if (session && user) {
    redirect(`/dashboard/${user.role}`);
  }

  return (
    <>
      <div className="container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Command className="mr-2 h-6 w-6" />
            LearnQuest
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-left">
              <LoginFormUI />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
