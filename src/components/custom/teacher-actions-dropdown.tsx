import { Archive, Ellipsis, KeyRound, UserRoundPen } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function TeacherActionsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="right-0" variant="ghost" size="icon" asChild>
          <Ellipsis className="h-4 w-4 rotate-90" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-30">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer">
            <Archive className="mr-2 h-4 w-4" />
            <span>Archive this account</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer">
            <KeyRound className="mr-2 h-4 w-4" />
            <span>Reset password</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer">
            <UserRoundPen className="mr-2 h-4 w-4" />
            <span>Change username</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
