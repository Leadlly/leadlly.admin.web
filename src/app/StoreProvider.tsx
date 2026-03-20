"use client";

import { useRef } from "react";
import { Provider } from "react-redux";

import { IAdmin } from "@/helpers/types";
import { userData } from "@/redux/slices/userSlice";
import { AppStore, makeStore } from "@/redux/store";

export default function StoreProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: IAdmin | null;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (storeRef.current === null) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    storeRef.current.dispatch(userData(user));
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
