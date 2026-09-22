
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { signIn } from "next-auth/react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const router = useRouter();

  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, setIsGooglePending] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginAction(formData);

      if (!result.success) {
        setMessage(result.message);
        return;
      }

      router.push("/");
      router.refresh();
    });
  }

  async function handleGoogleLogin() {
    setMessage(null);
    setIsGooglePending(true);

    try {
      await signIn("google", {
        redirectTo: "/",
      });
    } catch (error) {
      console.error("Google login error:", error);

      setIsGooglePending(false);
      setMessage("Unable to continue with Google. Please try again.");
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4">
        <h1 className="h4 fw-bold mb-1">
          Welcome back
        </h1>

        <p className="text-muted small mb-4">
          Log in to your ShopFlow account.
        </p>

        {message && (
          <Alert variant="danger">
            {message}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>

            <Form.Control
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Password</Form.Label>

            <Form.Control
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </Form.Group>

          <div className="text-end mb-4">
            <Link
              href="/forgot-password"
              className="small"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-100"
            disabled={isPending || isGooglePending}
          >
            {isPending
              ? "Logging in..."
              : "Log in"}
          </Button>
        </Form>

        <div className="text-center my-4">
          <div className="d-flex align-items-center gap-3">
            <hr className="flex-grow-1" />

            <span className="text-muted small">
              OR
            </span>

            <hr className="flex-grow-1" />
          </div>
        </div>

        <div className="d-grid">
          <Button
            type="button"
            variant="outline-secondary"
            className="shop-google-button"
            onClick={handleGoogleLogin}
            disabled={isPending || isGooglePending}
          >
            {isGooglePending
              ? "Connecting to Google..."
              : "Continue with Google"}
          </Button>
        </div>

        <p className="text-center small text-muted mt-4 mb-0">
          Don&apos;t have an account?{" "}
          <Link href="/register">
            Sign up
          </Link>
        </p>
      </Card.Body>
    </Card>
  );
}

