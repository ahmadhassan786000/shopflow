import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  // Middleware already blocks page loads for non-admins; this is the real
  // enforcement layer and must never be skipped, per the authorization rule.
  if (!session?.user || !["ADMIN", "SUPER_ADMIN", "STAFF"].includes(session.user.role)) {
    redirect("/login");
  }

  return (
    <div className="d-flex min-vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 bg-light p-4">{children}</div>
    </div>
  );
}
