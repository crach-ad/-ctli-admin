"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./auth-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  HardHat,
  FlaskConical,
  Atom,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/staff", label: "Dashboard", icon: LayoutDashboard },
  { href: "/staff/field-inspections", label: "Field Inspections", icon: HardHat },
  { href: "/staff/concrete-tests", label: "Concrete Tests", icon: FlaskConical },
  { href: "/staff/nuclear-density", label: "Nuclear Density", icon: Atom },
];

export function StaffSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const sidebar = (
    <>
      <div className="border-b p-4">
        <h1 className="text-lg font-bold">CTLI Staff</h1>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/staff"
              ? pathname === "/staff"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
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
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="fixed left-4 top-4 z-50 rounded-md border bg-white p-2 shadow-sm md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-white transition-transform md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebar}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden h-screen w-64 flex-col border-r bg-white md:flex">
        {sidebar}
      </aside>
    </>
  );
}
