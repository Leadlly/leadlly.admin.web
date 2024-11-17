import type { Metadata } from "next";
import { Sidebar, MobileMenu } from "@/components";
// import { getMeetings } from "@/actions/meeting_actions";
// import { TMeetingsProps } from "@/helpers/types";

export const metadata: Metadata = {
  title: "Leadlly",
  description:
    "Say goodbye to one-size-fits-all! We tailor study plans and resources to your individual learning style and goals.",
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
//   const { meetings }: { meetings: TMeetingsProps[] } = await getMeetings("");
//   const inCompleteMeetingsLength = meetings.length;

  return (
    <>
      <section className="relative">
      <div className="hidden md:block md:fixed md:top-3 md:left-0 md:w-64 xl:w-60">
          <Sidebar  />
        </div>
        <div className="md:ml-20 h-main-height md:pr-2">
          {children}
        </div>
      </section>
      <section className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white shadow-[0_-1px_2px_0_rgba(0,0,0,0.1)] overflow-hidden">
        <MobileMenu  />
      </section>
    </>
  );
}
