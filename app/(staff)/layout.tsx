import { StaffSidebar } from "@/components/staff-sidebar";

export const dynamic = "force-dynamic";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <StaffSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6 pt-16 md:pt-6">{children}</main>
    </div>
  );
}
