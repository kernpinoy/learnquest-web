"use client";
import { useContext } from "react";
import { SidebarContext } from "~/providers/sidebar-provider";

// create hook

export function useSidebar() {
  // Access context from the provider
  const context = useContext(SidebarContext);

  // Throw error if not use inside SidebarProvider
  if (!context) {
    throw new Error("useSidebar can be only used inside SidebarProvider");
  }

  return context;
}
