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
import { Archive, Ellipsis, KeyRound, UserRoundPen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { db } from "~/db";

export default async function TeachersCard() {
  const teachers = await db.query.teachersInfoTable.findMany();

  if (teachers.length === 0) {
    return <div>No teachers found</div>;
  }

  return (
    <>
      {teachers.map(({ firstName, lastName, middleName, createdAt }, index) => (
        <Card
          className="hover:shadow-md rounded-lg hover:cursor-pointer"
          key={index}
        >
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
                  <DropdownMenuItem className="hover:cursor-pointer">
                    <UserRoundPen className="mr-2 h-4 w-4" />
                    <span>Change username</span>
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
                <AvatarFallback>
                  {firstName.charAt(0) + lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-lg font-bold">
                  <Link
                    className="hover:underline"
                    href="/dashboard/admin/teacher/"
                  >
                    {`${firstName} ${
                      middleName.charAt(0).toUpperCase() + "."
                    } ${lastName}`}
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground">
                  Account created on <time>{createdAt.toLocaleString()}</time>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
