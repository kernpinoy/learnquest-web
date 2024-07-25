"use client";

import { ReactNode } from "react";
import Sidebar from "../shared/sidebar";
import { useSidebar } from "../shared/sidebar-context";
import { cn } from "~/lib/utils";

export default function AdminSidebarLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen } = useSidebar();

  return (
    <>
      <Sidebar />

      <main
        className={cn(
          "min-h-screen bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        {children}
      </main>
    </>
  );
}
