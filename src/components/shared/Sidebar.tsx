"use client";

import SidebarDesktop from "./SidebarDesktop";
import { userSidebarLinks } from "@/helpers/constants";

const Sidebar = () => {
  return (
    <SidebarDesktop
      sidebar={userSidebarLinks}
      // meetingsLength={meetingsLength}
    />
  );
};

export default Sidebar;
