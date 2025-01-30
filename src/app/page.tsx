import { Command } from "lucide-react";
import { redirect } from "next/navigation";
import LoginFormUI from "~/components/login-form/login-form-ui";
import { validateRequest } from "~/lib/validate-request";
import Image from "next/image";
import PEL2 from "~/components/PEL2.svg";
import Logo from "~/components/Logo.svg";

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
          <div className="flex h-full items-center justify-center"></div>
        </div>
        <div className="flex flex-col items-center space-y-6 lg:p-8">
          <div className="flex space-x-4">
            <Image src={PEL2} alt="Logo of PEL2" width={150} height={150} />
            <Image
              src={Logo}
              alt="Logo of LearnQuest"
              width={150}
              height={150}
            />
          </div>
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
