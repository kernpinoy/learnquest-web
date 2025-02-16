import {
  type LucideIcon,
  Archive,
  LayoutDashboard,
  Settings,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getTeacherMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard/teacher",
          label: "Dashboard",
          active: pathname === "/dashboard/teacher",
          icon: LayoutDashboard,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard/teacher/archives",
          label: "Archives",
          active: pathname.includes("/dashboard/teacher/archives"),
          icon: Archive,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard/teacher/settings",
          label: "Settings",
          active: pathname === "/dashboard/teacher/settings",
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
