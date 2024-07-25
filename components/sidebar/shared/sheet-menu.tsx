"use client";

import { usePathname } from "next/navigation";
import { ScrollArea } from "~/components/ui/scroll-area";
import getMenuList from "~/lib/lists";
import { cn } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Ellipsis } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { CollapseMenuButton } from "./collapse-menu-button";
import { useSidebar } from "./sidebar-context";

interface MenuProps {
  isAdmin?: boolean;
}

export default function SheetMenu({ isAdmin = true }: MenuProps) {
  const pathname = usePathname(); // Hook for getting pathname
  const menuList = getMenuList(pathname, isAdmin); // Function for getting menu list
  const { isOpen, toggleSidebar } = useSidebar(); // Hook for getting sidebar

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-8 h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
          {menuList.map(({ groupLabel, menus }, index) => (
            // Group label
            <li key={index} className={cn("w-full", groupLabel ? "pt-5" : "")}>
              {/* Render Label */}
              {isOpen && groupLabel ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && groupLabel ? (
                <TooltipProvider>
                  {/* Render Label with tooltip closed when sidebar closed*/}
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full" asChild>
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : null}
              {/** Render actual links to be clicked */}
              {menus.map(
                ({ href, label, icon: Icon, active, submenus }, index) =>
                  submenus.length === 0 ? (
                    <div className="w-full" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={active ? "secondary" : "ghost"}
                              className="w-full justify-start h-10 mb-1"
                              asChild
                            >
                              <Link href={href}>
                                <span
                                  className={cn(isOpen === false ? "" : "mr-4")}
                                >
                                  <Icon size={18} />
                                </span>
                                <p
                                  className={cn(
                                    "max-w-[200px] truncate",
                                    !isOpen
                                      ? "-translate-x-96 opacity-100"
                                      : "translate-x-0 opacity-100"
                                  )}
                                >
                                  {label}
                                </p>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={active}
                        submenus={submenus}
                      />
                    </div>
                  )
              )}
            </li>
          ))}
        </ul>
      </nav>
    </ScrollArea>
  );
}
