import { QueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import ArchivedClassroomsArea from "~/components/custom/archived-classroom-area";
import ContentLayout from "~/components/sidebar/shared/content-layout";
import { validateRequest } from "~/lib/validate-request";
import { db } from "~/server/db";
import { teachersInfo } from "~/server/db/schema";
import { getArchivedClassroomsByTeacher } from "~/server/functions/classroom";
import { getTeacher } from "~/server/functions/teachers";

export default async function ArchivePage() {
  const { session, user } = await validateRequest();

  if (!session && !user) {
    redirect("/");
  }

  if (user.role !== "teacher") {
    redirect(`/dashboard/${user.role}`);
  }

  const queryClient = new QueryClient();
  const [teacher] = await getTeacher(user?.id!);

  queryClient.prefetchQuery({
    queryKey: ["teacher-archived-classrooms", teacher?.id!],
    queryFn: async () => getArchivedClassroomsByTeacher(teacher?.id!),
  });

  return (
    <ContentLayout title="Archives" isTeacher={true}>
      <ArchivedClassroomsArea teacherId={teacher?.id!} />
    </ContentLayout>
  );
}
