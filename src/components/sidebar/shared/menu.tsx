"use client";

import { usePathname } from "next/navigation";
import { ScrollArea } from "~/components/ui/scroll-area";
import getMenuList from "~/lib/list";
import { cn } from "~/lib/utils";
import { useSidebar } from "~/hooks/use-sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Ellipsis, LogOut } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { CollapseMenuButton } from "./collapse-menu-button";
import logoutAccountAction from "~/server/actions/logout-account";
import { useState } from "react";

interface MenuProps {
  isAdmin?: boolean;
}

export default function Menu({ isAdmin = true }: MenuProps) {
  const pathname = usePathname(); // Hook for getting pathname
  const menuList = getMenuList(pathname, isAdmin); // Function for getting menu list
  const { isOpen } = useSidebar(); // Hook for getting sidebar state
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSignOut = () => {
    logoutAccountAction();
    setIsDialogOpen(false);
  };

  return (
    <>
      <ScrollArea className="[&>div>div[style]]:!block">
        <nav className="mt-8 h-full w-full">
          <ul className="flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1 px-2 lg:min-h-[calc(100vh-32px-40px-32px)]">
            {menuList.map(({ groupLabel, menus }, index) => (
              // Group label
              <li
                key={index}
                className={cn("w-full", groupLabel ? "pt-5" : "")}
              >
                {/* Render Label */}
                {isOpen && groupLabel ? (
                  <p className="max-w-[248px] truncate px-4 pb-2 text-sm font-medium text-muted-foreground">
                    {groupLabel}
                  </p>
                ) : !isOpen && groupLabel ? (
                  <TooltipProvider>
                    {/* Render Label with tooltip closed when sidebar closed*/}
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger className="w-full" asChild>
                        <div className="flex w-full items-center justify-center">
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
                                className="mb-1 h-10 w-full justify-start"
                                asChild
                              >
                                <Link href={href} prefetch={true}>
                                  {Icon && ( // Only render the icon if it exists
                                    <span
                                      className={cn(
                                        isOpen === false ? "" : "mr-4",
                                      )}
                                    >
                                      <Icon size={18} />
                                    </span>
                                  )}
                                  <p
                                    className={cn(
                                      "max-w-[200px] truncate",
                                      !isOpen
                                        ? "-translate-x-96 opacity-100"
                                        : "translate-x-0 opacity-100",
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
                    ),
                )}
              </li>
            ))}
            <li className="flex w-full grow items-end">
              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <TooltipProvider disableHoverableContent>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="mt-5 h-10 w-full justify-center"
                        >
                          <span className={cn(isOpen === false ? "" : "mr-4")}>
                            <LogOut size={18} />
                          </span>
                          <p
                            className={cn(
                              "whitespace-nowrap",
                              isOpen === false
                                ? "hidden opacity-0"
                                : "opacity-100",
                            )}
                          >
                            Sign out
                          </p>
                        </Button>
                      </AlertDialogTrigger>
                    </TooltipTrigger>
                    {isOpen === false && (
                      <TooltipContent side="right">Sign out</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to sign out?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be logged out of your current session and
                      redirected to the login page.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSignOut}>
                      Sign Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </li>
          </ul>
        </nav>
      </ScrollArea>
    </>
  );
}
