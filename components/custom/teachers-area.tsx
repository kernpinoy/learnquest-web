"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Salad, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { useGetTeacherDetails } from "~/data/use-get-teacher-details";
import AddTeacherDialog from "./teacher-dialog-parts/add-teacher-dialog";
import TeachersAreaSkeleton from "../skeletons/teachers-area-skeleton";
import TeacherActionsDropdown from "./teacher-actions-dropdown";

export default function TeachersArea() {
  const { data: teachers, isLoading } = useGetTeacherDetails();

  if (isLoading) {
    return <TeachersAreaSkeleton />;
  }

  if (teachers?.length === 0) {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden flex items-center justify-center">
            <p className="scroll-m-20 break-all break-words text-xl font-medium tracking-tight text-center">
              There are no teachers accounts. Click the button below to add one.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <AddTeacherDialog />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <AddTeacherDialog />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {teachers?.map(({ fullName, createdAt, username, id }) => (
          <Card
            className="hover:shadow-md rounded-lg hover:cursor-pointer"
            key={id}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teacher</CardTitle>
              <TeacherActionsDropdown />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    className="mr-4"
                    loading="lazy"
                    src="https://github.com/shadcn.png"
                    asChild
                  >
                    <Image
                      src="https://github.com/shadcn.png"
                      height={460}
                      width={460}
                      alt={""}
                    />
                  </AvatarImage>
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-lg font-bold">
                    <Link
                      className="hover:underline"
                      href={`/dashboard/admin/${username}`}
                    >
                      {fullName}
                    </Link>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Account created on{" "}
                    <time>{createdAt.toLocaleDateString()}</time>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
