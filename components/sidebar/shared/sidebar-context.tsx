"use client";

import { createContext, useState, useContext, ReactNode } from "react";

// typesafety uwu
interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

// create context
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Provider definition
export function SidebarProvider({ children }: { children: ReactNode }) {
  // Create state for opening and closing sidebar
  const [isOpen, setIsOpen] = useState(false);

  // For toggling sidebar
  const toggleSidebar = () => setIsOpen((prevState) => !prevState);

  // Open sidebar
  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);

  // return the Provider
  return (
    <SidebarContext.Provider
      value={{ isOpen, toggleSidebar, openSidebar, closeSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

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
