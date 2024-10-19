import React from "react";
import Sidebar from "../root/sidebar/index"; 
import MobileMenu from "../../components/shared/MobileMenu";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const meetingsLength = 0;

  return (
    <>
      <section className="relative flex">
        <div className="hidden md:block md:fixed md:top-3">
          <Sidebar meetingsLength={meetingsLength} /> 
        </div>
        <div className="md:ml-20 xl:ml-[261px] h-main-height pl-4 pr-4 md:pr-2">
          {children}
        </div>
      </section>
      <section className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white shadow-[0_-1px_2px_0_rgba(0,0,0,0.1)] overflow-hidden">
        <MobileMenu meetingsLength={meetingsLength} />
      </section>
    </>
  );
};

export default MainLayout;
