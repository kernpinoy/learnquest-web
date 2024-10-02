import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ClassroomArea from "~/components/custom/classroom-area";
import ContentLayout from "~/components/sidebar/shared/content-layout";
import {
  getAllTeacherUsername,
  getTeacherClassroom,
  getTeacherFullName,
} from "~/server/functions/teachers";

export async function generateStaticParams() {
  const teachers = getAllTeacherUsername();

  return (await teachers).map((teacher) => {
    username: teacher.username;
  });
}

export default async function TeacherClassesPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;
  const teacherFullName = await getTeacherFullName(username);
  const query = new QueryClient();

  await query.prefetchQuery({
    queryKey: ["teacher-classroom", username],
    queryFn: async () => getTeacherClassroom(username),
  });

  return (
    <ContentLayout title={`${teacherFullName}'s Class`}>
      <HydrationBoundary state={dehydrate(query)}>
        <ClassroomArea username={username} />
      </HydrationBoundary>
    </ContentLayout>
  );
}
