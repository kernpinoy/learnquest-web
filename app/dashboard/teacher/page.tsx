import logoutAccountAction from "~/actions/logout-account-action";
import ContentLayout from "~/components/sidebar/shared/content-layout";
import { Button } from "~/components/ui/button";

export default function AdminDashboardPage() {
  return (
    <ContentLayout title="Dashboard">
      <div>
        <form action={logoutAccountAction}>
          <Button>Logout</Button>
        </form>
      </div>
    </ContentLayout>
  );
}
