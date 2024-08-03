import TeachersCard from "~/components/custom/teachers-card";
import ContentLayout from "~/components/sidebar/shared/content-layout";
import { Button } from "~/components/ui/button";

export default function AdminDashboardPage() {
  return (
    <ContentLayout title="Dashboard">
      <div className="flex justify-end mb-4">
        <Button>Add teacher</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TeachersCard />
      </div>
    </ContentLayout>
  );
}
