import React from "react";

import { getUser } from "@/actions/user_actions";

import StoreProvider from "./StoreProvider";

const Provider = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const userData = await getUser();

  return <StoreProvider user={userData?.admin}>{children}</StoreProvider>;
};

export default Provider;
