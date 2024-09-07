"use client";

import { createContext, useState, ReactNode } from "react";

// typesafety uwu
interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// create context
export const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined
);

// Provider definition
export function SidebarProvider({ children }: { children: ReactNode }) {
  // Create state for opening and closing sidebar
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // For toggling sidebar
  const toggleSidebar = () => setIsOpen((prevState) => !prevState);

  // return the Provider
  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}
