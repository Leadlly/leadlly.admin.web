"use client";
import { Logo } from "../../components";
import { TSidebarLink } from "../../helpers/types";
import { cn } from "../../lib/utils";

type SidebarDesktopProps = {
  sidebar: TSidebarLink[];
  meetingsLength: number;
};

const SidebarDesktop: React.FC<SidebarDesktopProps> = ({ sidebar, meetingsLength }) => {
  return (
    <aside className="bg-sidebar-background w-full h-full md:w-64 xl:w-60 md:h-main-height md:rounded-xl overflow-y-hidden shadow-xl">
      <div className="w-full px-[25px] py-4">
        <a href="/" className="block">
          <Logo
            fullLogoWidth={150}
            fullLogoHeight={50}
            fullLogoClassName="block md:hidden xl:block"
            smallLogoWidth={90}
            smallLogoHeight={90}
            smallLogoClassName="hidden md:block xl:hidden"
          />
        </a>
      </div>
      <ul className="flex flex-col justify-start items-start md:items-center xl:items-start gap-2 h-[calc(100dvh-97px)] overflow-x-hidden overflow-y-auto custom__scrollbar px-[25px] md:px-3 xl:px-[25px] py-3">
      <h4 className="px-4 py-3 text-[#5A10D9]">ADMIN TOOLS</h4>
        {sidebar.map((item) => {
          return (
            <a
              href={item.href} 
              key={item.href}
              className={cn(
                "relative px-4 py-3 rounded-xl md:rounded-full xl:rounded-xl w-full flex items-center justify-start md:justify-center xl:justify-start"
              )}
            >
              <li className="relative z-10 flex items-center gap-3 capitalize text-base md:text-[20px]">
                <div className="relative">
                  <item.icon
                    className={cn(
                      "stroke-[#5A10D9]",
                    )}
                  />
                  {item.label === "chat" && meetingsLength > 0 && (
                    <span
                      className={cn(
                        "absolute -top-1 -left-1 text-[10px] font-semibold size-4 rounded-full flex items-center justify-center p-1 text-white bg-[#0fd679]"
                      )}
                    >
                      {meetingsLength}
                    </span>
                  )}
                </div>
                <div className="md:hidden xl:block">
                  {item.label}
                </div>
              </li>
            </a>
          );
        })}
      </ul>
    </aside>
  );
};

export default SidebarDesktop;
