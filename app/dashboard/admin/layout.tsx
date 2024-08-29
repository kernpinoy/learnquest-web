import { ReactNode } from "react";
import AdminSidebarLayout from "~/components/sidebar/admin/admin-sidebar-layout";
import { SidebarProvider } from "~/providers/sidebar-provider";

export default function AdminDashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <SidebarProvider>
      <AdminSidebarLayout>{children}</AdminSidebarLayout>
    </SidebarProvider>
  );
}
