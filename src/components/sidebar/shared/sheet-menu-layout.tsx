"use client";

import Link from "next/link";
import { MenuIcon, PanelsTopLeft } from "lucide-react";

import { Button } from "~/components/ui/button";
import Menu from "~/components/sidebar/shared/menu";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "~/components/ui/sheet";

export default function SheetMenuLayout() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col px-3 sm:w-72" side="left">
        <SheetHeader>
          <Button
            className="flex items-center justify-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link
              href="/dashboard/admin"
              className="flex items-center gap-2"
              prefetch={true}
            >
              <PanelsTopLeft className="mr-1 h-6 w-6" />
              <h1 className="text-lg font-bold">LearnQuest</h1>
            </Link>
          </Button>
        </SheetHeader>
        {/* <Menu isAdmin /> */}
      </SheetContent>
    </Sheet>
  );
}
