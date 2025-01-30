import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ClassroomArea from "~/components/custom/classroom-area";
import ContentLayout from "~/components/sidebar/shared/content-layout";
import GoBack from "~/components/ui/go-back";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  getAllTeacherUsername,
  getTeacherClassroom,
  getTeacherFullName,
  getTeacherInfo,
} from "~/server/functions/teachers";
import { getUserId } from "~/server/functions/users";
import PersonalInfoForm from "./info";

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

  console.log(username);

  const teacherFullName = await getTeacherFullName(username);
  const userId = await getUserId(username);
  const teacherInfo = await getTeacherInfo(userId!);
  const query = new QueryClient();

  await query.prefetchQuery({
    queryKey: ["teacher-classroom", userId],
    queryFn: async () => getTeacherClassroom(userId!),
  });

  return (
    <ContentLayout title={`${teacherFullName}'s Class`}>
      <GoBack />
      <HydrationBoundary state={dehydrate(query)}>
        <div className="mb-10">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList>
              <TabsTrigger value="profile">Personal Info</TabsTrigger>
              <TabsTrigger value="classroom">Classroom</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <PersonalInfoForm teacherInfo={teacherInfo} />
            </TabsContent>
            <TabsContent value="classroom">
              <ClassroomArea userId={userId!} />
            </TabsContent>
          </Tabs>
        </div>
      </HydrationBoundary>
    </ContentLayout>
  );
}
