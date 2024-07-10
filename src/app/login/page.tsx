import { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginCard from "~/components/own/LoginCard";

export const metadata: Metadata = {
  title: "Login",
  description: "App",
};

const buttonAction = async () => {
  "use server";
  redirect("/dashboard");
};

export default function LoginScreen() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen w-fullx">
      <div className="bg-primary flex flex-col justify-center items-center">
        <div className="bg-primary-foreground rounded-full p-4">
          <MountainIcon className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-bold text-primary-foreground mt-4">
          Welcome to Acme Inc.
        </h1>
        <p className="text-primary-foreground/80 mt-2">
          Unlock your potential with our powerful tools.
        </p>
      </div>

      <div className="flex flex-col justify-center items-center">
        {/* <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <form action={buttonAction} className="space-y-4">
            <div>
              <Label htmlFor="email">Username</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </div> */}
        <div className="w-[34rem]">
          <LoginCard className="bg-primary" />
        </div>
      </div>
    </div>
  );
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
