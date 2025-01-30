"use client";

import { useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Archive } from "lucide-react"; // You may want to adjust this icon for classrooms
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useGetArchivedClassrooms } from "~/data/use-get-archived-classrooms"; // Adjust the hook for classrooms
import ClassroomsAreaSkeleton from "../skeletons/classroom-area-skeleton"; // Adjust the skeleton for classrooms
import { Input } from "~/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import ParagraphIsh from "../paragraph-ish";
import ArchivedClassroomActionsDropdown from "./archived-classroom-dropdown"; // Adjusted dropdown for classrooms

interface ArchivedClassroom {
  id: string; // Classroom ID
  classCode: string;
  name: string; // Classroom Name
  archivedAt: Date | null; // Allow archivedAt to be null
}

interface ArchivedClassroomsGridProps {
  classrooms: ArchivedClassroom[];
  searchTerm: string;
}

function NoArchivedClassrooms() {
  return (
    <ParagraphIsh>
      <div className="flex items-center justify-center overflow-hidden">
        <p className="scroll-m-20 break-all text-center text-xl font-medium tracking-tight">
          There are no archived classroom accounts.
        </p>
      </div>
    </ParagraphIsh>
  );
}

function NoSearchResults() {
  return (
    <ParagraphIsh>
      <div className="flex items-center justify-center overflow-hidden">
        <p className="scroll-m-20 break-words text-center text-xl font-medium tracking-tight">
          No archived classrooms found matching your search criteria.
        </p>
      </div>
    </ParagraphIsh>
  );
}

function ArchivedClassroomsGrid({
  classrooms,
  searchTerm,
}: ArchivedClassroomsGridProps) {
  const filteredClassrooms = useMemo(() => {
    return classrooms.filter((classroom) => {
      const classroomName = classroom.name.toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();

      return (
        classroomName.includes(searchTermLower) ||
        classroom.id.toLowerCase().includes(searchTermLower)
      );
    });
  }, [classrooms, searchTerm]);

  if (filteredClassrooms.length === 0) {
    return <NoSearchResults />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {filteredClassrooms.map((classroom) => (
        <Card
          className="flex h-full flex-col rounded-lg transition-all hover:shadow-lg"
          key={classroom.id}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Archived Classroom
            </CardTitle>
            <ArchivedClassroomActionsDropdown
              classroomId={classroom.id}
              classCode={classroom.classCode}
            />
          </CardHeader>
          <CardContent className="flex flex-grow flex-col justify-center">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback>
                  <Archive />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-grow">
                <div className="truncate text-lg font-bold">
                  {classroom.name}
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  Archived on{" "}
                  <time>
                    {classroom.archivedAt
                      ? new Date(classroom.archivedAt).toLocaleDateString()
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

export default function ArchivedClassroomsArea({
  teacherId,
}: {
  teacherId: string;
}) {
  const { data: classrooms, isLoading } = useGetArchivedClassrooms(teacherId); // Adjust the hook for classrooms
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
    [searchParams, router, pathName],
  );

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="archived-classroom-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        >
          <ClassroomsAreaSkeleton />
        </motion.div>
      )}
      {!isLoading && classrooms && classrooms.length === 0 && (
        <motion.div
          key="no-archived-classrooms"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        >
          <NoArchivedClassrooms />
        </motion.div>
      )}
      {!isLoading && classrooms && classrooms.length > 0 && (
        <motion.div
          key={`archived-classrooms-grid-${classrooms.length}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        >
          <div className="mb-4 flex justify-between">
            <Input
              className="w-72 lg:w-96"
              placeholder="Search archived classrooms..."
              defaultValue={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <ArchivedClassroomsGrid
            classrooms={classrooms || []}
            searchTerm={searchTerm}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
