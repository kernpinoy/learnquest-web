"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Link from "next/link";
import { useGetTeacherDetails } from "~/data/use-get-teacher-details";
import AddTeacherDialog from "./teacher-dialog-parts/add-teacher-dialog";
import TeachersAreaSkeleton from "../skeletons/teachers-area-skeleton";
import TeacherActionsDropdown from "./teacher-actions-dropdown";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface TeacherDetails {
  fullName: string;
  createdAt: Date;
  username: string;
  id: string;
}

interface TeachersGridProps {
  teachers: TeacherDetails[];
}

function NoTeachers() {
  return (
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
  );
}

function TeachersGrid({ teachers }: TeachersGridProps) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex justify-between mb-4">
        <Input className="w-72 lg:w-96" placeholder="Search..." />
        <AddTeacherDialog />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {teachers.map(({ fullName, createdAt, username, id }) => (
          <Card
            className="transition-all hover:shadow-lg rounded-lg hover:cursor-pointer h-full flex flex-col"
            key={id}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teacher</CardTitle>
              <TeacherActionsDropdown teacherId={id}/>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-grow min-w-0">
                  <div className="text-lg font-bold truncate">
                    <Link
                      className="hover:underline"
                      href={`${pathname}/${username}`}
                    >
                      {fullName}
                    </Link>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
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

export default function TeachersArea() {
  const { data: teachers, isLoading } = useGetTeacherDetails();

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="teacher-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        >
          <TeachersAreaSkeleton />
        </motion.div>
      )}
      {!isLoading && teachers && teachers.length === 0 && (
        <motion.div
          key="no-teachers"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        >
          <NoTeachers />
        </motion.div>
      )}
      {!isLoading && teachers && teachers.length > 0 && (
        <motion.div
          key={`teachers-grid-${teachers.length}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        >
          <TeachersGrid teachers={teachers} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
