import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import ClassroomArea from "~/components/custom/classroom-area";
import ContentLayout from "~/components/sidebar/shared/content-layout";
import { validateRequest } from "~/lib/validate-request";
import { getTeacherClassroom } from "~/server/functions/teachers";

export default async function TeacherDashboardPage() {
  const { session, user } = await validateRequest();

  if (!session && !user) {
    redirect("/");
  }

  if (user.role !== "teacher") {
    redirect(`/dashboard/${user.role}`);
  }

  const query = new QueryClient();

  await query.prefetchQuery({
    queryKey: ["teacher-classroom", user.id],
    queryFn: async () => getTeacherClassroom(user.id),
  });

  return (
    <ContentLayout title="Dashboard" isTeacher={true}>
      <HydrationBoundary state={dehydrate(query)}>
        <ClassroomArea userId={user.id} />
      </HydrationBoundary>
    </ContentLayout>
  );
}
