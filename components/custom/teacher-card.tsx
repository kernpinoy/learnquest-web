import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Archive, Ellipsis, KeyRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import Link from "next/link";

export default function TeacherCard() {
  return (
    <Card className="hover:shadow-md rounded-lg hover:cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Teacher</CardTitle>
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
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              className="mr-4"
              loading="lazy"
              src="https://github.com/shadcn.png"
              asChild
            >
              <Image
                src="https://github.com/shadcn.png"
                height={460}
                width={460}
                alt={""}
              />
            </AvatarImage>
            <AvatarFallback>JT</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-lg font-bold">
              <Link
                className="hover:underline"
                href="/dashboard/admin/teacher/"
              >
                Jeanelle Toque
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Account created on <time>2021-09-01</time>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
