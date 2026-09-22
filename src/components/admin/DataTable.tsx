import { Table, Card, CardBody } from "react-bootstrap";
import type { ReactNode } from "react";

export interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  emptyMessage = "No records found.",
}: {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="text-muted text-center py-5">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="table-responsive">
      <Table hover className="align-middle">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.header}
                className={col.className}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td
                  key={col.header}
                  className={col.className}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export function DashboardCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardBody className="d-flex align-items-center justify-content-between">
        <div>
          <p className="text-muted small mb-1">
            {label}
          </p>

          <p className="h4 fw-bold mb-0">
            {value}
          </p>
        </div>

        {icon && (
          <div className="text-primary opacity-75">
            {icon}
          </div>
        )}
      </CardBody>
    </Card>
  );
}