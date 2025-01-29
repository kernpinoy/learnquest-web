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
} from "~/server/functions/classroom";
import { FileManager } from "~/components/upload-stuff/file-manager";
import { getUploadedFiles } from "~/server/functions/uploads";
import ClassroomSettings from "./classroom-settings";

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
  const name = getClassroomName(classCode);

  queryClient.prefetchQuery({
    queryKey: ["teacher-classroom-file-uploads", classCode],
    queryFn: async () => await getUploadedFiles(classCode),
  });

  queryClient.prefetchQuery({
    queryFn: async () => getClassroomStudents(classCode),
    queryKey: ["teacher-classroom-students", classCode],
  });

  return (
    <ContentLayout title={await name} isTeacher={true}>
      <div className="min-h-screen">
        <GoBack />
        <Tabs defaultValue="students" className="w-full">
          <TabsList>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="learningMaterials">
              Learning Materials
            </TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
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
          <TabsContent value="leaderboard">TODO: LEADERBOARD!</TabsContent>
          <TabsContent value="classroomSettings">
            <ClassroomSettings classCode={classCode} />
          </TabsContent>
        </Tabs>
      </div>
    </ContentLayout>
  );
}
