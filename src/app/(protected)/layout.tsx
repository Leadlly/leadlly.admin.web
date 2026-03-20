import React from "react";
import Provider from "../provider";
import QueryProvider from "../QueryProvider";
import { getCookie } from "@/actions/cookie_actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const token = await getCookie();
  if (!token) {
    return redirect("/login");
  }

  return (
    <Provider>
      <QueryProvider>{children}</QueryProvider>
    </Provider>
  );
};

export default ProtectedLayout;
