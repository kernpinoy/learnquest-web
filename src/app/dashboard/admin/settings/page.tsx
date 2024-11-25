import ContentLayout from "~/components/sidebar/shared/content-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { validateRequest } from "~/lib/validate-request";
import { redirect } from "next/navigation";
import UserInfoForm from "./user-info-form";

export default async function AdminSettings() {
  const { session, user } = await validateRequest();

  if (!session || !user) {
    redirect("/");
  }

  if (user.role !== "admin") {
    redirect(`/dashboard/${user.role}`);
  }

  return (
    <ContentLayout title="Settings">
      <Tabs defaultValue="user-info">
        <TabsList>
          <TabsTrigger value="user-info">User Info</TabsTrigger>
        </TabsList>
        <TabsContent value="user-info">
          <UserInfoForm userId={user.id} />
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
}
