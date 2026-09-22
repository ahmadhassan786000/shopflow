"use client";

import { useEffect } from "react";
import { Container, Button } from "react-bootstrap";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <Container className="py-5 text-center">
      <h2 className="h4 fw-bold mb-3">Something went wrong</h2>
      <p className="text-muted mb-4">Please try again, or head back to the homepage.</p>
      <div className="d-flex gap-2 justify-content-center">
        <Button variant="primary" onClick={() => reset()}>Try again</Button>
        <Button variant="outline-secondary" href="/">Go home</Button>
      </div>
    </Container>
  );
}
