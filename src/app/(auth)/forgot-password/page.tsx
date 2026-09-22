"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { forgotPasswordAction } from "./actions";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await forgotPasswordAction(formData);
      setMessage(result.message);
    });
  }

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4">
        <h1 className="h4 fw-bold mb-1">Reset your password</h1>
        <p className="text-muted small mb-4">Enter your email and we&apos;ll send you a reset link.</p>

        {message && <Alert variant="info">{message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" type="email" required />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100" disabled={isPending}>
            {isPending ? "Sending..." : "Send reset link"}
          </Button>
        </Form>

        <p className="text-center small text-muted mt-4 mb-0">
          <Link href="/login">Back to login</Link>
        </p>
      </Card.Body>
    </Card>
  );
}
