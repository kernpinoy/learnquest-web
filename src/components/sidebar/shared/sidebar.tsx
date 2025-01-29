"use client";

import { cn } from "~/lib/utils";
import { useSidebar } from "~/hooks/use-sidebar";
import { SidebarToggle } from "~/components/sidebar/shared/sidebar-toggle";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { PanelsTopLeft } from "lucide-react";
import AdminMenu from "./menu";

export default function Sidebar({ isAdmin = true }: { isAdmin: boolean }) {
  const { isOpen } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0",
        isOpen === false ? "w-[90px]" : "w-72",
      )}
    >
      <SidebarToggle />

      <div className="relative flex h-full flex-col overflow-y-auto px-3 py-4 shadow-md dark:shadow-zinc-800">
        <Button
          className={cn(
            "mb-1 transition-transform duration-300 ease-in-out",
            isOpen === false ? "translate-x-1" : "translate-x-0",
          )}
          variant="link"
          asChild
        >
          <Link
            href="/dashboard/admin"
            className="flex items-center gap-2"
            prefetch={true}
          >
            <PanelsTopLeft className="mr-1 h-6 w-6" />
            <h1
              className={cn(
                "whitespace-nowrap text-lg font-bold transition-[transform,opacity,display] duration-300 ease-in-out",
                isOpen === false
                  ? "hidden -translate-x-96 opacity-0"
                  : "translate-x-0 opacity-100",
              )}
            >
              LearnQuest
            </h1>
          </Link>
        </Button>

        <AdminMenu isAdmin={isAdmin} />
      </div>
    </aside>
  );
}
