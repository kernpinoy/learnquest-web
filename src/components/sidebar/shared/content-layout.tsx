import { ReactNode } from "react";
import NavBar from "./nav-bar";
import { cn } from "~/lib/utils";

interface ContentLayoutProps {
  className?: string;
  title: string;
  children: ReactNode;
}

export default function ContentLayout({
  className,
  title,
  children,
}: ContentLayoutProps) {
  return (
    <>
      <div className={cn(className)}>
        <NavBar title={title} />
        <div className="pt-8 pb-8 px-4 sm:px-8">{children}</div>
      </div>
    </>
  );
}
