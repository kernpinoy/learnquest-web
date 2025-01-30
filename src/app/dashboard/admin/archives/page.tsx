import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ArchivedTeacherArea from "~/components/custom/archived-teacher-area";
import ContentLayout from "~/components/sidebar/shared/content-layout";
import GoBack from "~/components/ui/go-back";
import { getArchiveTeachers } from "~/server/functions/teachers";

const queryClient = new QueryClient();

queryClient.prefetchQuery({
  queryKey: ["admin-teacher-archived"],
  queryFn: async () => getArchiveTeachers(),
});

export default function ArchiveTeacherPage() {
  return (
    <ContentLayout title="Archives">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ArchivedTeacherArea />
      </HydrationBoundary>
    </ContentLayout>
  );
}
