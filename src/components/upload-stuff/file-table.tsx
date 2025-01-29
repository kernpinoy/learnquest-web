"use client";

import {
  Download,
  FileIcon,
  FolderIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface FileItem {
  id: string;
  name: string;
  size?: string;
  modified?: string;
}

interface FileTableProps {
  items?: FileItem[];
  onItemClick: (item: FileItem) => void;
  onDeleteItem: (item: FileItem) => void;
  onDownloadItem: (item: FileItem) => void;
}

function formatSize(sizeInBytes?: string): string {
  if (!sizeInBytes) return "-";

  const sizeInMB = parseFloat(sizeInBytes) / (1024 * 1024);
  return `${sizeInMB.toFixed(2)} MB`;
}

export function FileTable({
  items = [],
  onItemClick,
  onDeleteItem,
  onDownloadItem,
}: FileTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50%]">Name</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Modified</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No files available
            </TableCell>
          </TableRow>
        ) : (
          items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <button
                  onClick={() => onItemClick(item)}
                  className="flex items-center space-x-2 rounded hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <FileIcon className="h-5 w-5 text-gray-400" />
                  <span>{item.name}</span>
                </button>
              </TableCell>
              <TableCell>{formatSize(item.size)}</TableCell>
              <TableCell>{new Date(item.modified!).toLocaleString()}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDownloadItem(item)}
                      className="hover:cursor-pointer"
                    >
                      <Download className="w mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteItem(item)}
                      className="text-red-600 hover:cursor-pointer focus:text-red-600"
                    >
                      <Trash2Icon className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
