"use server";
import * as auth from "@/auth";
import paths from "@/paths";

export async function signIn() {
  return auth.signIn("spotify", { redirectTo: paths.top });
}

export async function signOut() {
  return auth.signOut({ redirectTo: "/" });
}
