"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { registerAction } from "./actions";
import { registerSchema } from "@/lib/validations/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [serverMessage, setServerMessage] = useState<{ type: "success" | "danger"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Client-side validation for immediate UX feedback
    const parsed = registerSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>);
      return;
    }
    setErrors({});

    startTransition(async () => {
      const result = await registerAction(formData);
      if (!result.success) {
        setServerMessage({ type: "danger", text: result.message });
        if (result.fieldErrors) setErrors(result.fieldErrors);
        return;
      }
      setServerMessage({ type: "success", text: result.message });
      setTimeout(() => router.push("/login"), 1200);
    });
  }

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4">
        <h1 className="h4 fw-bold mb-1">Create your account</h1>
        <p className="text-muted small mb-4">Join ShopFlow to track orders and save favorites.</p>

        {serverMessage && <Alert variant={serverMessage.type}>{serverMessage.text}</Alert>}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" isInvalid={!!errors.name} />
            <Form.Control.Feedback type="invalid">{errors.name?.[0]}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" type="email" isInvalid={!!errors.email} />
            <Form.Control.Feedback type="invalid">{errors.email?.[0]}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control name="password" type="password" isInvalid={!!errors.password} />
            <Form.Control.Feedback type="invalid">{errors.password?.[0]}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control name="confirmPassword" type="password" isInvalid={!!errors.confirmPassword} />
            <Form.Control.Feedback type="invalid">{errors.confirmPassword?.[0]}</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100" disabled={isPending}>
            {isPending ? "Creating account..." : "Create account"}
          </Button>
        </Form>


        <p className="text-center small text-muted mt-4 mb-0">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </Card.Body>
    </Card>
  );
}
