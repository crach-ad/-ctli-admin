"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./auth-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FolderOpen,
  HardHat,
  FlaskConical,
  Atom,
  CalendarDays,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/concrete-field", label: "Field Inspections", icon: HardHat },
  { href: "/concrete-tests", label: "Concrete Tests", icon: FlaskConical },
  { href: "/nuclear-density", label: "Nuclear Density", icon: Atom },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="border-b p-4">
        <h1 className="text-lg font-bold">CTLI Management</h1>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-600"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
