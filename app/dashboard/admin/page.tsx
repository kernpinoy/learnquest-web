import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import TeachersArea from "~/components/custom/teachers-area";
import ContentLayout from "~/components/sidebar/shared/content-layout";
import { getTeacherDetails } from "~/server/functions/teachers";

export default async function AdminDashboardPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["teachers-card"],
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
