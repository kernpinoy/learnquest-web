import ContentLayout from "~/components/sidebar/shared/content-layout";
import { getAllClassCode } from "~/server/functions/teachers";
import DataTable from "~/app/dashboard/admin/[username]/[classcode]/data-table";
import GoBack from "~/components/ui/go-back";

export async function generateStaticParams() {
  const classCodes = getAllClassCode();

  return (await classCodes).map((classCode) => ({
    classcode: classCode.classCode,
  }));
}

export default function ClassroomPage({
  params,
}: {
  params: { classcode: string };
}) {
  const { classcode } = params;

  return (
    <ContentLayout title="Class Profile">
      <GoBack />
      <DataTable />
    </ContentLayout>
  );
}
