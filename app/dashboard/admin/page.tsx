import TeacherCard from "~/components/custom/teacher-card";
import ContentLayout from "~/components/sidebar/shared/content-layout";

export default function AdminDashboardPage() {
  return (
    <ContentLayout title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TeacherCard />
      </div>
    </ContentLayout>
  );
}
