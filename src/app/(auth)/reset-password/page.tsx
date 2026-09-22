"use client";

import { Suspense } from "react";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { resetPasswordAction } from "./actions";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [message, setMessage] = useState<{ type: "success" | "danger"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("token", token);
    startTransition(async () => {
      const result = await resetPasswordAction(formData);
      setMessage({ type: result.success ? "success" : "danger", text: result.message });
      if (result.success) setTimeout(() => router.push("/login"), 1200);
    });
  }

  if (!token) {
    return <Alert variant="danger">Missing or invalid reset link. Please request a new one.</Alert>;
  }

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4">
        <h1 className="h4 fw-bold mb-4">Set a new password</h1>
        {message && <Alert variant={message.type}>{message.text}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>New password</Form.Label>
            <Form.Control name="password" type="password" required />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control name="confirmPassword" type="password" required />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100" disabled={isPending}>
            {isPending ? "Updating..." : "Update password"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
