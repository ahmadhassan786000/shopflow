"use client";

import { useState, useTransition } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { UserRound } from "lucide-react";
import { updateProfileAction } from "../actions";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateProfileAction(formData);
      setMessage({ type: result.success ? "success" : "danger", text: result.message });
    });
  }

  return (
    <div className="shop-account-form-card">
      <div className="shop-account-form-icon">
        <UserRound size={20} />
      </div>

      {message && <Alert variant={message.type}>{message.text}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Full name</Form.Label>
          <Form.Control name="name" defaultValue={name} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control defaultValue={email} disabled />
          <Form.Text muted>Email cannot be changed here.</Form.Text>
        </Form.Group>

        <Button type="submit" variant="primary" disabled={isPending} className="shop-account-form-submit">
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </Form>
    </div>
  );
}
