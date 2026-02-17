"use client";

import { useAuth } from "./auth-provider";
import type { UserRole } from "@/lib/types";

interface RoleGateProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGate({ allowedRoles, children, fallback }: RoleGateProps) {
  const { roles, loading } = useAuth();

  if (loading) return null;

  const hasAccess = roles.some((role) => allowedRoles.includes(role));
  if (!hasAccess) return fallback ?? null;

  return <>{children}</>;
}
