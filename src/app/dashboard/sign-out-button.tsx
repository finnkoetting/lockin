"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
    >
      Ausloggen
    </button>
  );
}
