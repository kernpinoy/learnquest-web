import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Ellipsis, Pencil, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export type Student = {
  lrn: string;
  fullName: string;
  sex: string;
  createdAt: Date;
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
        >
          Name
          <ArrowUpDown className="2-4 ml-2 h-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "lrn",
    header: () => <div className="text-left font-black">LRN</div>,
  },
  {
    accessorKey: "sex",
    header: () => <div className="text-left font-black">Sex</div>,
    cell: ({ row }) => {
      const val = row.getValue("sex") as string;

      return <div className="font-medium capitalize">{val}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-left font-black">Created on</div>,
    cell: ({ row }) => {
      const val = row.getValue("createdAt") as Date;

      return <div className="font-medium">{val.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const val = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-ri h-8 w-8 p-0">
              <span className="sr-only">Open actions</span>
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:cursor-pointer">
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit student info</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 hover:cursor-pointer focus:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete student</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
