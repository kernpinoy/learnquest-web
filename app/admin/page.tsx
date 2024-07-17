import { redirect } from "next/navigation";
import { toast } from "sonner";
import logoutAccountAction from "~/actions/logout-account-action";
import { Button } from "~/components/ui/button";
import { validateRequest } from "~/lib/validate-request";

export default async function TestPage() {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/");
  }

  if (user?.role !== "admin") {
    //toast.warning("Access denied.");
    return redirect(`/?${encodeURI(`type=warning&message=Access denied.`)}`);
  }

  // TODO: Find a better way to logout
  return (
    <div>
      <form action={logoutAccountAction}>
        <Button>Logout</Button>
      </form>
    </div>
  );
}
