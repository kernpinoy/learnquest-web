import ContentLayout from "~/components/sidebar/shared/content-layout";

export default function TeacherClassPage({
  params,
}: {
  params: { classcode: string };
}) {
  const { classcode } = params;

  return (
    <ContentLayout title="asdasd">
      <div>
        Hello from classes!
        <div>Classcode: {classcode}</div>
      </div>
    </ContentLayout>
  );
}
