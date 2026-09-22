"use client";

import { useEffect } from "react";
import { Container, Button } from "react-bootstrap";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the real error server-side / to your monitoring tool.
    // Never show error.message or error.stack to the end user.
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <Container className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center">
          <h1 className="display-6 fw-bold mb-3">Something went wrong</h1>
          <p className="text-muted mb-4">
            We hit an unexpected error on our end. Please try again — if the problem continues, contact support.
          </p>
          <Button variant="primary" onClick={() => reset()}>Try again</Button>
        </Container>
      </body>
    </html>
  );
}
