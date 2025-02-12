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
import {
  getClassroomName,
  getClassroomStudents,
  getStudentGameScore,
} from "~/server/functions/classroom";
import { getUploadedFiles } from "~/server/functions/uploads";
import { FileManager } from "~/components/upload-stuff/file-manager";
import ClassroomSettings from "./classroom-settings";
import StudentLeaderboard from "~/components/student-stuffs/student-leaderboard";

export default async function ClassManagementPage({
  params,
}: {
  params: { classcode: string };
}) {
  const { classcode: classCode } = params;

  const { session, user } = await validateRequest();

  if (!session || !user || user.role !== "admin") {
    redirect("/");
  }

  const name = getClassroomName(classCode);

  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: ["teacher-classroom-file-uploads", classCode],
    queryFn: async () => await getUploadedFiles(classCode),
  });

  queryClient.prefetchQuery({
    queryFn: async () => getClassroomStudents(classCode),
    queryKey: ["teacher-classroom-students", classCode],
  });

  queryClient.prefetchQuery({
    queryKey: ["teacher-clasroom-students-leaderboards", classCode],
    queryFn: async () => getStudentGameScore(classCode),
  });

  return (
    <ContentLayout title={await name} isTeacher={false}>
      <div className="min-h-screen">
        <GoBack />
        <Tabs defaultValue="students" className="w-full">
          <TabsList>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="learningMaterials">
              Learning Materials
            </TabsTrigger>
            <TabsTrigger value="classroomSettings">
              Classroom Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="students">
            <HydrationBoundary state={dehydrate(queryClient)}>
              <StudentTab classCode={classCode} />
            </HydrationBoundary>
          </TabsContent>
          <TabsContent value="learningMaterials">
            <HydrationBoundary state={dehydrate(queryClient)}>
              <FileManager classCode={classCode} />
            </HydrationBoundary>
          </TabsContent>
          <TabsContent value="leaderboard">
            <HydrationBoundary state={dehydrate(queryClient)}>
              <StudentLeaderboard classCode={classCode} />
            </HydrationBoundary>
          </TabsContent>
          <TabsContent value="classroomSettings">
            <ClassroomSettings classCode={classCode} />
          </TabsContent>
        </Tabs>
      </div>
    </ContentLayout>
  );
}
