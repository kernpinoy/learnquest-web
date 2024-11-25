import { ColumnDef } from "@tanstack/react-table"

export type Student = {
  lrn: string;
  schoolYear: string;
  name: string;
  gender: string;
  password: string;
  classCode: string;
}

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "lrn",
    header: "LRN"
  },
  {
    accessorKey: "schoolYear",
    header: "School Year"
  },
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "gender",
    header: "Gender"
  },
  {
    accessorKey: "password",
    header: "Password"
  },
  {
    accessorKey: "classCode",
    header: "Class code"
  }
]
