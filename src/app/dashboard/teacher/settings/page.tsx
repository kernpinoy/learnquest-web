import ContentLayout from "~/components/sidebar/shared/content-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import PersonalInfoForm from "./personal-info-form";
import { validateRequest } from "~/lib/validate-request";
import { getTeacherInfo } from "~/server/functions/teachers";
import { redirect } from "next/navigation";
import UserInfoForm from "./user-info-form";
import AccountManagementForm from "./account-management";

export default async function TeacherSettings() {
  const { session, user } = await validateRequest();

  if (!session && !user) {
    redirect("/");
  }

  if (user.role !== "teacher") {
    redirect(`/dashboard/${user.role}`);
  }

  const teacherInfo = getTeacherInfo(user.id);

  return (
    <ContentLayout title="Settings">
      <Tabs defaultValue="personal-info">
        <TabsList>
          <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
          <TabsTrigger value="user-info">User Info</TabsTrigger>
          <TabsTrigger value="account">Account Management</TabsTrigger>
        </TabsList>
        <TabsContent value="personal-info">
          <PersonalInfoForm teacherInfo={(await teacherInfo)!} />
        </TabsContent>
        <TabsContent value="user-info">
          <UserInfoForm userId={user.id} />
        </TabsContent>
        <TabsContent value="account">
          <AccountManagementForm userId={user.id} />
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
}
