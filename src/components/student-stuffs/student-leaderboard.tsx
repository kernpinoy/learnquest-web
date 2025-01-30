"use client";

import { Medal } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useStudentScore } from "~/data/use-get-student-scores";
import { cn } from "~/lib/utils";
import { Loader2 } from "lucide-react";

interface StudentLeaderboardProps {
  classCode: string;
}

export default function StudentLeaderboard({
  classCode,
}: StudentLeaderboardProps) {
  const { data: scores, isLoading } = useStudentScore(classCode);
  const scoreSlice = scores?.slice(0, 3);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </Card>
    );
  }

  if (!scores || scores.length === 0) {
    return (
      <Card className="p-6">
        <CardContent className="flex h-full items-center justify-center">
          <div className="text-lg text-gray-500">No scores available.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {/* Top 3 Medal Winners */}
      <div className="mb-8 flex justify-center gap-4">
        {scoreSlice?.map((student, index) => {
          const medalColor =
            index === 0
              ? "text-[#FFD700]" // Gold for 1st place
              : index === 1
                ? "text-[#C0C0C0]" // Silver for 2nd place
                : "text-[#CD7F32]"; // Bronze for 3rd place
          const rankTextColor =
            index === 0
              ? "text-[#FFD700]"
              : index === 1
                ? "text-[#C0C0C0]"
                : "text-[#CD7F32]";

          return (
            <Card key={student.id} className="w-32">
              <CardContent className={cn("flex flex-col items-center p-4")}>
                <Medal className={cn("mb-2 h-16 w-16", medalColor)} />
                <div className={cn("text-xl font-bold", rankTextColor)}>
                  {index + 1}
                  {index === 0 ? "st" : index === 1 ? "nd" : "rd"}
                </div>
                <div className="text-center text-sm">{student.firstName}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Leaderboard Table */}
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">Rank</TableHead>
            <TableHead className="text-left">Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scores?.map((student, index) => (
            <TableRow key={student.id}>
              <TableCell className="text-center font-bold">
                {index + 1}
              </TableCell>
              <TableCell>{student.fullName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
