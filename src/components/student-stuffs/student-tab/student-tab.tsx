"use client";

import { useGetClassroomStudents } from "~/data/use-get-classroom-students";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion"; // Import framer-motion

// Loading component with animation
function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }} // Initial state
      animate={{ opacity: 1 }} // Animate to full opacity
      exit={{ opacity: 0 }} // Exit state
      transition={{ duration: 0.5, ease: "easeInOut" }} // Ease in-out transition
    >
      Loading...
    </motion.div>
  );
}

export default function StudentTab({
  classCode,
  isAdmin = false,
}: {
  classCode: string;
  isAdmin?: boolean;
}) {
  const { data: students, isLoading } = useGetClassroomStudents(classCode);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns as unknown as ColumnDef<unknown, unknown>[]}
          data={students!}
          classCode={classCode}
        />
      )}
    </>
  );
}
