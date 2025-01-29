"use client";

import { useEffect, useState } from "react";
import { UploadIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { FileTable } from "./file-table";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { getSignedUrl } from "~/server/upload/file-upload";
import { deleteUpload } from "~/server/upload/delete-upload";
import useGetUploadedFiles from "~/data/use-get-file-uploads";

interface FileItem {
  id: string;
  name: string;
  size?: string;
  modified?: string;
}

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

export function FileManager({ classCode }: { classCode: string }) {
  const { data: files, isLoading } = useGetUploadedFiles(classCode);
  const items = files as unknown as FileItem[];
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isUploadDialogOpen) {
      setFileError("");
      setSelectedFile(null);
    }
  }, [isUploadDialogOpen]);

  useEffect(() => {
    if (!isDeleteOpen) {
      setFileToDelete(null);
      setFileError("");
    }
  }, [isDeleteOpen]);

  const handleItemClick = async (item: FileItem) => {
    const toastId = toast.loading("Loading file...");

    try {
      const response = await fetch(
        `/api/view?file=${encodeURIComponent(item.name)}`,
      );

      if (response.ok) {
        const data = await response.json();
        const downloadUrl = data.url;

        // Open the download URL in a new tab
        window.open(downloadUrl, "_blank", "noopener");
        toast.success("File is ready to be viewed.", {
          id: toastId,
        });
      } else {
        // Parse and display the error message from the response
        const errorData = await response.json();
        toast.error(
          errorData.error || "An unexpected error occurred. Please try again.",
          { id: toastId },
        );
      }
    } catch (error) {
      console.error("Error fetching the file:", error);
      toast.error(
        "Failed to fetch the file. Check your connection and try again.",
        { id: toastId },
      );
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError(""); // Clear any previous errors

    if (file) {
      if (file.type !== "application/pdf") {
        setFileError("Please select a PDF file only.");
        setSelectedFile(null);
        event.target.value = "";
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setIsUploading(true);

      const signedUrlResult = await getSignedUrl(
        selectedFile.type,
        selectedFile.size,
        selectedFile.name,
        classCode,
      );

      if (signedUrlResult.failure !== undefined) {
        setIsUploading(false);
        return;
      }

      const url = signedUrlResult.success?.url;

      try {
        await fetch(url, {
          method: "PUT",
          body: selectedFile,
          headers: new Headers({
            "Content-Type": selectedFile?.type,
          }),
        });

        toast.success("Uploaded successfully.");
      } catch (error) {
        toast.error("Upload did not succeed.");
        console.error("Failed to upload file:", error);
        setIsUploading(false);
        return;
      }
    }

    setIsUploading(false);
    setIsUploadDialogOpen(false);
  };

  const handleDeleteItem = (item: FileItem) => {
    setFileToDelete(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (fileToDelete) {
      setIsDeleting(true);
      try {
        const response = await deleteUpload(fileToDelete.id);

        if (response.failure) {
          toast.error(response.failure);
        } else {
          toast.success(response.success);
        }
      } catch (error) {
        console.error("Error deleting the file:", error);
        toast.error("Failed to delete the file. Please try again.");
      }
      setIsDeleting(false);
      setIsDeleteOpen(false);
      setFileToDelete(null);
    }
  };

  const handleDownloadItem = async (item: FileItem) => {
    const toastId = toast.loading("Loading file...");

    try {
      const response = await fetch(
        `/api/download?file=${encodeURIComponent(item.name)}`,
      );

      if (response.ok) {
        const data = await response.json();
        const downloadUrl = data.url;

        // Open the download URL in a new tab
        window.open(downloadUrl, "_blank");
        toast.success("File is ready to download.", {
          id: toastId,
        });
      } else {
        // Parse and display the error message from the response
        const errorData = await response.json();
        toast.error(
          errorData.error || "An unexpected error occurred. Please try again.",
          { id: toastId },
        );
      }
    } catch (error) {
      console.error("Error fetching the file:", error);
      toast.error(
        "Failed to fetch the file. Check your connection and try again.",
      );
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Files</CardTitle>
        <div className="flex items-center space-x-4">
          {/* <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="Search files..."
              className="w-64 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div> */}
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loading />
        ) : (
          <FileTable
            items={items}
            onItemClick={handleItemClick}
            onDeleteItem={handleDeleteItem}
            onDownloadItem={handleDownloadItem}
          />
        )}
      </CardContent>

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>
          <Input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hover:cursor-pointer"
          />
          {fileError && (
            <p className="text-sm font-medium text-red-500">{fileError}</p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isUploading}
              onClick={() => {
                setIsUploadDialogOpen(false);
                setFileError("");
                setSelectedFile(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={
                !selectedFile || isUploading || selectedFile.size > 10485760
              } // 10MB in bytes
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete {fileToDelete?.name}?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
