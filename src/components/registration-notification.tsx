"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { toast } from "sonner";

type StudentRegistration = {
  id: string;
  fullName: string;
  message: string;
  createdAt: Date;
  classCode: string;
  className: string;
};

export default function RegistrationNotification() {
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [declineId, setDeclineId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<StudentRegistration[]>([]);
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  const handleCloseDialogs = () => {
    setNotificationDialogOpen(false);
    setDeclineDialogOpen(false);
  };

  const removeNotification = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications
        .filter((notification) => notification.id !== id)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    );
  };

  // Fetch notifications via SSE
  useEffect(() => {
    const eventSource = new EventSource("/api/notification"); // Replace with your SSE endpoint

    eventSource.onmessage = (event) => {
      try {
        const data: StudentRegistration[] = JSON.parse(event.data);
        setNotifications(data);
      } catch (error) {
        console.error("Failed to parse SSE data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleAccept = async (id: string, classCode: string) => {
    console.log(`Accepted notification with ID: ${id}`);
    try {
      setProcessingIds((prev) => [...prev, id]);
      const response = await fetch("/api/notification", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, classCode: classCode }),
      });

      if (!response.ok) {
        toast.error("Network response was not ok. Try again later.");
      }

      const data = await response.json();
      toast.success(`${data.message}`);
      removeNotification(id);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setProcessingIds((prev) => prev.filter((pid) => pid !== id));
    }
  };

  const handleDeclineConfirm = async () => {
    try {
      if (!declineId) return;
      setProcessingIds((prev) => [...prev, declineId]);

      const response = await fetch("/api/notification", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: declineId }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message || "Network response was not ok. Try again later",
        );
      }

      toast.success(data.message);
      removeNotification(declineId);
    } catch (error: any) {
      toast.error(
        error.message || "Unable to decline registration. Try again.",
      );
    } finally {
      setProcessingIds((prev) => prev.filter((pid) => pid !== declineId));
      handleCloseDialogs();
      setDeclineId(null);
    }
  };

  return (
    <>
      <Dialog onOpenChange={setNotificationDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-[1.2rem] w-[1.2rem]" />
            {notifications.length > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center p-0 text-xs"
              >
                {notifications.length}
              </Badge>
            )}
            <span className="sr-only">Open notifications</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>Your recent notifications.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] pr-4">
            <div className="grid gap-4 py-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                      processingIds.includes(notification.id)
                        ? "pointer-events-none bg-muted opacity-50"
                        : "hover:bg-accent/50"
                    }`}
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium leading-none">
                        {notification.fullName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        wants to join the class {notification.className}
                      </p>
                      <p className="text-xs text-muted-foreground/60">
                        Registered at{" "}
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <Button
                        size="sm"
                        disabled={processingIds.includes(notification.id)}
                        onClick={() =>
                          handleAccept(notification.id, notification.classCode)
                        }
                      >
                        {processingIds.includes(notification.id)
                          ? "Accepting..."
                          : "Accept"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={processingIds.includes(notification.id)}
                        onClick={() => {
                          setDeclineId(notification.id);
                          setDeclineDialogOpen(true);
                        }}
                      >
                        {processingIds.includes(notification.id)
                          ? "Declining..."
                          : "Decline"}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No new registrations
                </p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={declineDialogOpen}
        onOpenChange={(open) => {
          setDeclineDialogOpen(open);
          if (!open) setDeclineId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently decline the
              join request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeclineConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Decline
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
