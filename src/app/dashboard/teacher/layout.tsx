import { ReactNode } from "react";
import TeacherSidebarLayout from "~/components/sidebar/teacher/teacher-sidebar-layout";
import { SidebarProvider } from "~/providers/sidebar-provider";

export default function TeacherDashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <SidebarProvider>
      <TeacherSidebarLayout>{children}</TeacherSidebarLayout>
    </SidebarProvider>
  );
}
