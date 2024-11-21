
"use client";

import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

interface SessionAuthProviderProps {
  children: ReactNode;
}

function SessionAuthProvider({ children }: SessionAuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default SessionAuthProvider;