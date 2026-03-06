"use server";

import { cookies } from "next/headers";

export const getCookie = async (name = "leadlly.in_admin_token") => {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value ?? "";
};
