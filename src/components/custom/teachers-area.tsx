"use client";

import { useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetTeacherDetails } from "~/data/use-get-teacher-details";
import AddTeacherDialog from "./teacher-dialog-parts/add-teacher-dialog";
import TeachersAreaSkeleton from "../skeletons/teachers-area-skeleton";
import TeacherActionsDropdown from "./teacher-actions-dropdown";
import { Input } from "~/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import ParagraphIsh from "../paragraph-ish";

interface TeacherDetails {
  fullName: string;
  createdAt: Date;
  username: string;
  id: string;
  teacherId: string;
}

interface TeachersGridProps {
  teachers: TeacherDetails[];
  searchTerm: string;
}

function NoTeachers() {
  return (
    <ParagraphIsh>
      <div className="overflow-hidden flex items-center justify-center">
        <p className="scroll-m-20 break-words text-xl font-medium tracking-tight text-center">
          There are no teachers accounts. Click the button below to add one.
        </p>
      </div>
      <div className="flex items-center justify-center">
        <AddTeacherDialog />
      </div>
    </ParagraphIsh>
  );
}

function NoSearchResults() {
  return (
    <ParagraphIsh>
      <div className="overflow-hidden flex items-center justify-center">
        <p className="scroll-m-20 break-words text-xl font-medium tracking-tight text-center">
          No teachers found matching your search criteria.
        </p>
      </div>
    </ParagraphIsh>
  );
}

function TeachersGrid({ teachers, searchTerm }: TeachersGridProps) {
  const filteredTeachers = useMemo(() => {
    return teachers.filter(
      (teacher) =>
        teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teachers, searchTerm]);

  if (filteredTeachers.length === 0) {
    return <NoSearchResults />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {filteredTeachers.map(
        ({ fullName, createdAt, username, id, teacherId }) => (
          <Card
            className="transition-all hover:shadow-lg rounded-lg hover:cursor-pointer h-full flex flex-col"
            key={id}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teacher</CardTitle>
              <TeacherActionsDropdown userId={id} teacherId={teacherId} />
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
                      href={`/dashboard/admin/${username}`}
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
        )
      )}
    </div>
  );
}

export default function TeachersArea() {
  const { data: teachers, isLoading } = useGetTeacherDetails();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchTerm = e.target.value;

      const params = new URLSearchParams(searchParams);
      if (newSearchTerm) {
        params.set("search", newSearchTerm);
      } else {
        params.delete("search");
      }

      router.replace(`/dashboard/admin?${params.toString()}`);
    },
    [searchParams, router]
  );

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
          <div className="flex justify-between mb-4">
            <Input
              className="w-72 lg:w-96"
              placeholder="Search..."
              defaultValue={searchTerm}
              onChange={handleSearchChange}
            />
            <AddTeacherDialog />
          </div>
          <TeachersGrid teachers={teachers} searchTerm={searchTerm} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
