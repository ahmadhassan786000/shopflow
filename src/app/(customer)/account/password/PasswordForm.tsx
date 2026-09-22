"use client";

import { useState, useTransition } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { KeyRound } from "lucide-react";
import { changePasswordAction } from "../actions";

export function PasswordForm() {
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await changePasswordAction(formData);

      setMessage({
        type: result.success ? "success" : "danger",
        text: result.message,
      });

      if (result.success) {
        form.reset();
      }
    });
  }

  return (
    <div className="shop-account-form-card">
      <div className="shop-account-form-icon shop-account-form-icon-amber">
        <KeyRound size={20} />
      </div>

      {message && <Alert variant={message.type}>{message.text}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Current password</Form.Label>
          <Form.Control name="currentPassword" type="password" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>New password</Form.Label>
          <Form.Control name="newPassword" type="password" required />
          <Form.Text muted>
            At least 8 characters, with an uppercase letter, a lowercase letter and a number.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Confirm new password</Form.Label>
          <Form.Control name="confirmNewPassword" type="password" required />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={isPending} className="shop-account-form-submit">
          {isPending ? "Updating..." : "Update password"}
        </Button>
      </Form>
    </div>
  );
}
