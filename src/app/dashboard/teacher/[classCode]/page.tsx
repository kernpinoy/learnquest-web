import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import GoBack from "~/components/ui/go-back";
import ContentLayout from "~/components/sidebar/shared/content-layout";
import StudentTab from "~/components/student-stuffs/student-tab/student-tab";
import { validateRequest } from "~/lib/validate-request";
import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getClassroomStudents } from "~/server/functions/classroom";

export default async function ClassManagementPage({
  params,
}: {
  params: { classCode: string };
}) {
  const { classCode } = params;

  const { session, user } = await validateRequest();

  if (!session || !user || user.role !== "teacher") {
    redirect("/");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["teacher-classroom-students", classCode],
    queryFn: async () => getClassroomStudents(classCode),
  });

  return (
    <ContentLayout title="Classroom files">
      <div className="min-h-screen">
        <GoBack />
        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="learningMaterials">
              Learning Materials
            </TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="classroomSettings">
              Classroom Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <HydrationBoundary state={dehydrate(queryClient)}>
              <StudentTab classCode={classCode} />
            </HydrationBoundary>
          </TabsContent>
          <TabsContent value="learningMaterials">TODO: UPLOAD!</TabsContent>
          <TabsContent value="leaderboard">TODO: LEADERBOARD!</TabsContent>
          <TabsContent value="classroomSettings">
            TODO: ARCHIVE N DELETE
          </TabsContent>
        </Tabs>
      </div>
    </ContentLayout>
  );
}
