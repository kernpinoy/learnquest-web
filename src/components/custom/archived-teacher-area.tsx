"use client";

import { useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useGetArchiveTeacher } from "~/data/use-get-archived-teachers";
import TeachersAreaSkeleton from "../skeletons/teachers-area-skeleton";
import { Input } from "~/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import ParagraphIsh from "../paragraph-ish";
import ArchivedTeacherActionsDropdown from "./archived-teacher-dropdown";

interface ArchivedTeacher {
  id: string; // from teachers_info.id
  userId: string; // from teachers_info.userId
  firstName: string;
  middleName: string;
  lastName: string;
  archivedAt: Date | null; // Allow archivedAt to be null
}

interface ArchivedTeachersGridProps {
  teachers: ArchivedTeacher[];
  searchTerm: string;
}

function NoArchivedTeachers() {
  return (
    <ParagraphIsh>
      <div className="overflow-hidden flex items-center justify-center">
        <p className="scroll-m-20 break-all text-xl font-medium tracking-tight text-center">
          There are no archived teacher accounts.
        </p>
      </div>
    </ParagraphIsh>
  );
}

function NoSearchResults() {
  return (
    <ParagraphIsh>
      <div className="overflow-hidden flex items-center justify-center">
        <p className="scroll-m-20 break-words text-xl font-medium tracking-tight text-center">
          No archived teachers found matching your search criteria.
        </p>
      </div>
    </ParagraphIsh>
  );
}

function ArchivedTeachersGrid({
  teachers,
  searchTerm,
}: ArchivedTeachersGridProps) {
  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const fullName =
        `${teacher.firstName} ${teacher.middleName} ${teacher.lastName}`.toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();

      return (
        fullName.includes(searchTermLower) ||
        teacher.id.toLowerCase().includes(searchTermLower) ||
        teacher.userId.toLowerCase().includes(searchTermLower)
      );
    });
  }, [teachers, searchTerm]);

  if (filteredTeachers.length === 0) {
    return <NoSearchResults />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {filteredTeachers.map((teacher) => (
        <Card
          className="transition-all hover:shadow-lg rounded-lg h-full flex flex-col"
          key={teacher.id}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Archived Teacher
            </CardTitle>
            <ArchivedTeacherActionsDropdown
              userId={teacher.userId}
              teacherId={teacher.id}
            />
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
                  {`${teacher.firstName} ${teacher.middleName} ${teacher.lastName}`}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  Archived on{" "}
                  <time>
                    {teacher.archivedAt
                      ? new Date(teacher.archivedAt).toLocaleDateString()
                      : "N/A"}
                  </time>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ArchivedTeachersArea() {
  const { data: teachers, isLoading } = useGetArchiveTeacher();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const pathName = usePathname();

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchTerm = e.target.value;
      const params = new URLSearchParams(searchParams);

      if (newSearchTerm) {
        params.set("search", newSearchTerm);
      } else {
        params.delete("search");
      }

      router.replace(`${pathName}?${params.toString()}`);
    },
    [searchParams, router]
  );

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="archived-teacher-loading"
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
          key="no-archived-teachers"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        >
          <NoArchivedTeachers />
        </motion.div>
      )}
      {!isLoading && teachers && teachers.length > 0 && (
        <motion.div
          key={`archived-teachers-grid-${teachers.length}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        >
          <div className="flex justify-between mb-4">
            <Input
              className="w-72 lg:w-96"
              placeholder="Search archived teachers..."
              defaultValue={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <ArchivedTeachersGrid
            teachers={teachers || []}
            searchTerm={searchTerm}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
