import Link from "next/link";
import ContentLayout from "~/components/sidebar/shared/content-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";
import {
  getAllTeacherUsername,
  getTeacherFullName,
} from "~/server/functions/teachers";

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

  const teacherFullName = getTeacherFullName(username);

  return (
    <ContentLayout title={`${await teacherFullName}'s Class`}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md rounded-lg hover:cursor-pointer">
          <CardHeader>
            <CardTitle
              className={cn("text-xl font-bold leading-none tracking-normal")}
            >
              Morning Class
            </CardTitle>
            <CardDescription>Time: 9:00 A.M - 10:00 A.M</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/dashboard/admin/${username}/1234567890`}>
              <p className="font-medium leading-none hover:underline">
                Enrolled students: 22
              </p>
            </Link>
          </CardContent>
          <CardFooter>
            <div className="grid gap-6 grid-cols-2">
              <div className="flex items-start text-sm text-muted-foreground">
                <p>S.Y: 2023 - 2024</p>
              </div>
              <div className="flex items-end text-sm text-muted-foreground">
                <p>Code: 123456789</p>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </ContentLayout>
  );
}
