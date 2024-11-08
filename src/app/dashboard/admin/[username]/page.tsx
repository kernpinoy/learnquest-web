import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ClassroomArea from "~/components/custom/classroom-area";
import ContentLayout from "~/components/sidebar/shared/content-layout";
import GoBack from "~/components/ui/go-back";
import {
  getAllTeacherUsername,
  getTeacherClassroom,
  getTeacherFullName,
} from "~/server/functions/teachers";
import { getUserId } from "~/server/functions/users";

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
  const userId = await getUserId(username)
  const query = new QueryClient();

  await query.prefetchQuery({
    queryKey: ["teacher-classroom", userId],
    queryFn: async () => getTeacherClassroom(userId!),
  });

  return (
    <ContentLayout title={`${teacherFullName}'s Class`}>
      <GoBack />
      <HydrationBoundary state={dehydrate(query)}>
        <ClassroomArea userId={userId!} />
      </HydrationBoundary>
    </ContentLayout>
  );
}
