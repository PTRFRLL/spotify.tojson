import React from "react";

// Shared column for every authed list page. Keeping the width here (rather than in each
// page or list component) means the loading, error and loaded states can't drift apart.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 m-2 max-w-2/3">{children}</div>;
}
