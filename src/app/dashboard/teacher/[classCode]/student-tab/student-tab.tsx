"use client";

import { useGetClassroomStudents } from "~/data/use-get-classroom-students";
import { DataTable } from "../data-table";
import { columns } from "../columns";

export default function StudentTab({ classCode }: { classCode: string }) {
  const { data: students, isLoading } = useGetClassroomStudents(classCode);

  return <DataTable columns={columns} data={students!} classCode={classCode} />;
}
