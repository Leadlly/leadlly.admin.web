import React from "react";
import StoreProvider from "./StoreProvider";

import { getUser } from "@/actions/user_actions";

const Provider = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const userData = await getUser();

  return <StoreProvider user={userData?.user}>{children}</StoreProvider>;
};

export default Provider;
