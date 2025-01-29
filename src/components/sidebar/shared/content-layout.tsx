import { ReactNode } from "react";
import NavBar from "./nav-bar";
import { cn } from "~/lib/utils";

interface ContentLayoutProps {
  className?: string;
  title: string;
  children: ReactNode;
  isTeacher?: boolean;
}

export default function ContentLayout({
  className,
  title,
  children,
  isTeacher = false,
}: ContentLayoutProps) {
  return (
    <>
      <div className={cn(className)}>
        <NavBar title={title} isTeacher={isTeacher} />
        <div className="px-4 pb-8 pt-8 sm:px-8">{children}</div>
      </div>
    </>
  );
}
