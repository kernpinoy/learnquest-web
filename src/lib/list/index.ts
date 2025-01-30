import { getAdminMenuList } from "./admin-menu-list";
import { getTeacherMenuList } from "./teacher-menu-list";

export default function getMenuList(pathname: string, isAdmin: boolean) {
  if (isAdmin) {
    return getAdminMenuList(pathname);
  } else {
    return getTeacherMenuList(pathname);
  }
}
