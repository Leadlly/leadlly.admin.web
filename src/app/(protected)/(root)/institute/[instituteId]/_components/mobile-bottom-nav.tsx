"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, GraduationCap, IndianRupee, LayoutDashboard, Users } from "lucide-react";

const navItems = [
  { title: "Home", segment: "", icon: LayoutDashboard },
  { title: "Batches", segment: "batches", icon: BookOpen },
  { title: "Students", segment: "students", icon: Users },
  { title: "Teachers", segment: "teachers", icon: GraduationCap },
  { title: "Fees", segment: "fees", icon: IndianRupee },
];

const MobileBottomNav = ({ instituteId }: { instituteId: string }) => {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const href = item.segment
            ? `/institute/${instituteId}/${item.segment}`
            : `/institute/${instituteId}`;
          const isActive = item.segment
            ? pathname.startsWith(href)
            : pathname === href;

          return (
            <Link
              key={item.title}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-xl transition-colors ${
                isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <item.icon className={`size-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
              <span className={`text-[10px] font-semibold ${isActive ? "text-primary" : "text-gray-400"}`}>
                {item.title}
              </span>
              {isActive && <span className="w-1 h-1 rounded-full bg-primary -mt-0.5" />}
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
};

export default MobileBottomNav;
