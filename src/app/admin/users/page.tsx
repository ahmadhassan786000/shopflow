import { Badge } from "react-bootstrap";
import { getAllUsersForAdmin } from "@/services/userService";
import { DataTable } from "@/components/admin/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { UserRowActions } from "./UserRowActions";

export const metadata = { title: "Manage Users" };

export default async function AdminUsersPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams.page ?? 1);
  const { items, totalPages } = await getAllUsersForAdmin(page);

  return (
    <>
      <h1 className="h4 fw-bold mb-4">Users</h1>
      <DataTable
        rows={items}
        emptyMessage="No users yet."
        columns={[
          { header: "Name", render: (u) => u.name },
          { header: "Email", render: (u) => <span className="small text-muted">{u.email}</span> },
          { header: "Role", render: (u) => <Badge bg={u.role === "CUSTOMER" ? "light" : "primary"} text={u.role === "CUSTOMER" ? "dark" : undefined}>{u.role}</Badge> },
          { header: "Status", render: (u) => u.isDisabled ? <Badge bg="danger">Disabled</Badge> : <Badge bg="success">Active</Badge> },
          { header: "Joined", render: (u) => <span className="small text-muted">{new Date(u.createdAt).toLocaleDateString()}</span> },
          { header: "", render: (u) => <UserRowActions userId={u.id} role={u.role} isDisabled={u.isDisabled} /> },
        ]}
      />
      <Pagination currentPage={page} totalPages={totalPages} />
    </>
  );
}
