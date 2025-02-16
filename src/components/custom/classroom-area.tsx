"use client";

import { useGetTeacherClassroom } from "~/data/use-get-teacher-classroom";
import { toast } from "sonner";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { MouseEvent } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { Input } from "../ui/input";
import ParagraphIsh from "../paragraph-ish";
import AddClassroomDialog from "./add-classroom-parts/add-classroom-dialog";

interface Classroom {
  id: string;
  name: string;
  teacherId: string;
  createdAt: Date;
  classSession: "morning" | "afternoon";
  classCode: string;
  maxStudents: number;
  schoolYear: string;
}

interface ClassroomCardProps {
  classrooms: Classroom[];
  copyToClipboard: (text: string) => void;
  isCopied: boolean;
  searchTerm: string;
}

function ClassroomSkeleton() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg bg-gray-300" />
        ))}
      </div>
    </>
  );
}

function NoClassrooms({ userId }: { userId: string }) {
  return (
    <ParagraphIsh>
      <p className="scroll-m-20 break-words break-all text-center text-xl font-medium tracking-tight">
        There are no classrooms created by the user.
      </p>
      <div className="flex items-center justify-center">
        <AddClassroomDialog userId={userId} />
      </div>
    </ParagraphIsh>
  );
}

function NoSearchResults() {
  return (
    <ParagraphIsh>
      <p className="scroll-m-20 break-words break-all text-center text-xl font-medium tracking-tight">
        No classrooms found matching your search criteria.
      </p>
    </ParagraphIsh>
  );
}

function ClassroomCard({
  classrooms,
  copyToClipboard,
  isCopied,
  searchTerm,
}: ClassroomCardProps) {
  const pathName = usePathname();

  function copy(e: MouseEvent<HTMLButtonElement>, text: string) {
    e.preventDefault();
    copyToClipboard(text);
  }

  const filteredClassroom = useMemo(() => {
    return classrooms.filter(
      (classroom) =>
        classroom.classCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classroom.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classroom.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classroom.teacherId?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [classrooms, searchTerm]);

  if (filteredClassroom.length === 0) {
    return <NoSearchResults />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {filteredClassroom.map(
        ({
          id,
          name,
          classCode,
          classSession,
          createdAt,
          schoolYear,
          maxStudents,
        }) => (
          <Card
            key={id}
            className="rounded-lg transition-all hover:cursor-pointer hover:shadow-lg"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-medium hover:underline">
                    <Link
                      className="font-medium"
                      href={`${pathName}/${classCode}`}
                      prefetch={true}
                    >
                      {name}
                    </Link>
                  </CardTitle>
                  <CardDescription>S.Y: {schoolYear}</CardDescription>
                </div>
                <Badge variant="secondary" className="sm capitalize">
                  {classSession}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium">Class code: {classCode}</p>
                <TooltipProvider disableHoverableContent>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => copy(e, classCode)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isCopied ? "Copied!" : "Copy class code"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-muted-foreground">
                Created: {new Date(createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ),
      )}
    </div>
  );
}

export default function ClassroomArea({
  userId,
  isAdmin = false,
}: {
  userId: string;
  isAdmin?: boolean;
}) {
  const { data: classrooms, isLoading } = useGetTeacherClassroom(userId);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const pathName = usePathname();

  const [isCopied, setIsCopied] = useState(false);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);

      toast("Copied to clipboard!", {
        description: `Class code copied to clipboard.`,
        duration: 2000,
        richColors: true,
        onAutoClose: () => {
          setIsCopied(false);
        },
        onDismiss: () => {
          setIsCopied(false);
        },
      });
    });
  }

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
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
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="classroom-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          >
            <ClassroomSkeleton />
          </motion.div>
        )}
        {!isLoading && classrooms && classrooms.length === 0 && (
          <motion.div
            key="no-classrooms"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          >
            <NoClassrooms userId={userId} />
          </motion.div>
        )}
        {!isLoading && classrooms && classrooms.length > 0 && (
          <motion.div
            key={`classroom-card-${classrooms.length}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          >
            <div className="mb-4 flex justify-between">
              <Input
                className="w-72 lg:w-96"
                placeholder="Search..."
                defaultValue={searchTerm}
                onChange={handleSearchChange}
              />
              <AddClassroomDialog userId={userId} />
            </div>
            <ClassroomCard
              classrooms={classrooms || []}
              copyToClipboard={copyToClipboard}
              isCopied={isCopied}
              searchTerm={searchTerm}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
