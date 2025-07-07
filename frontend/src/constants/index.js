import { LogOut, Trash2Icon } from "lucide-react";
import { handleLogout } from "../lib/utils";
const dropdownLinks = [
  {
    id: 1,
    path: "/login",
    linkName: "Logout",
    icon: LogOut,
    onClick: handleLogout,
  },
  {
    id: 2,
    path: "/delete-account",
    linkName: "Delete Account",
    icon: Trash2Icon,
  },
];
export default dropdownLinks;
