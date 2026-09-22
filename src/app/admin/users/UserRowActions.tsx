"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Form, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { setUserRoleAction, setUserDisabledAction } from "./actions";

const ROLES = ["CUSTOMER", "STAFF", "ADMIN", "SUPER_ADMIN"];

export function UserRowActions({ userId, role, isDisabled }: { userId: string; role: string; isDisabled: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    startTransition(async () => {
      const result = await setUserRoleAction(userId, e.target.value);
      if (result.success) {
        toast.success("Role updated");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  function toggleDisabled() {
    startTransition(async () => {
      const result = await setUserDisabledAction(userId, !isDisabled);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="d-flex gap-2 align-items-center">
      <Form.Select size="sm" style={{ width: 130 }} defaultValue={role} onChange={handleRoleChange} disabled={isPending}>
        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
      </Form.Select>
      <Button size="sm" variant={isDisabled ? "outline-success" : "outline-danger"} onClick={toggleDisabled} disabled={isPending}>
        {isDisabled ? "Enable" : "Disable"}
      </Button>
    </div>
  );
}
