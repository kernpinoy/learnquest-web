import { ModeToggle } from "~/components/theme-button";
import SheetMenuLayout from "./sheet-menu-layout";
import RegistrationNotification from "~/components/registration-notification";

interface NavBarProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  isTeacher?: boolean;
}

export default function NavBar({ title, isTeacher = false }: NavBarProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 flex h-14 items-center sm:mx-8">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Theme toggle */}
          {isTeacher && <RegistrationNotification />}
          <ModeToggle />
          {/* Avatar */}
        </div>
      </div>
    </header>
  );
}
