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

export function getAdminMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard/admin",
          label: "Dashboard",
          active: pathname === "/dashboard/admin",
          icon: LayoutDashboard,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "",
          label: "Archives",
          active: pathname.includes("/dashboard/admin/archives"),
          icon: Archive,
          submenus: [
            {
              href: "/dashboard/admin/archives/teacher",
              label: "Teacher",
              active: pathname === "/dashboard/admin/archives/teacher",
            },
            {
              href: "/dashboard/admin/archives/class",
              label: "Class",
              active: pathname === "/dashboard/admin/archives/class",
            },
            {
              href: "/dashboard/admin/archives/student",
              label: "Student",
              active: pathname === "/dashboard/admin/archives/student",
            },
          ],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard/admin/settings",
          label: "Settings",
          active: pathname === "/dashboard/admin/settings",
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
