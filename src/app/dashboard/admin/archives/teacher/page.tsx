import ArchivedTeacherArea from "~/components/custom/archived-teacher-area";
import ContentLayout from "~/components/sidebar/shared/content-layout";
import GoBack from "~/components/ui/go-back";

export default function ArchiveTeacherPage() {
  return (
    <ContentLayout title="Archives">
      <ArchivedTeacherArea />
    </ContentLayout>
  );
}
