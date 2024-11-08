import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import TeachersArea from "~/components/custom/teachers-area";
import ContentLayout from "~/components/sidebar/shared/content-layout";
import { getTeacherDetails } from "~/server/functions/teachers";
import { validateRequest } from "~/lib/validate-request"
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const { session, user } = await validateRequest();

  if (!session || !user || user.role !== "admin") {
    redirect("/");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["admin-teachers-card"],
    queryFn: getTeacherDetails,
  });

  return (
    <ContentLayout title="Dashboard">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TeachersArea />
      </HydrationBoundary>
    </ContentLayout>
  );
}
