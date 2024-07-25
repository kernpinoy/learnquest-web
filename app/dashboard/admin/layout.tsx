import { ReactNode } from "react";
import AdminSidebarLayout from "~/components/sidebar/admin/admin-sidebar-layout";
import { SidebarProvider } from "~/components/sidebar/shared/sidebar-context";

export default function AdminDashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <SidebarProvider>
      <AdminSidebarLayout>{children}</AdminSidebarLayout>
    </SidebarProvider>
  );
}
