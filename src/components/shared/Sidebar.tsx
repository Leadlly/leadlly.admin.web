import React from "react";
import SidebarDesktop from "./SidebarDesktop"; // Ensure this path is correct
import { userSidebarLinks } from "../../helpers/constants"; // Adjust path if necessary

type SidebarProps = {
  meetingsLength: number; // TypeScript prop definition
};

const Sidebar: React.FC<SidebarProps> = ({ meetingsLength }) => {
  return (
    <SidebarDesktop
      sidebar={userSidebarLinks}
      meetingsLength={meetingsLength}
    />
  );
};

export default Sidebar;
