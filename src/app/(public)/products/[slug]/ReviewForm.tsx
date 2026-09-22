"use client";

import { useState, useTransition } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Star } from "lucide-react";
import { submitReviewAction } from "./actions";

export function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState<{ type: "success" | "danger"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("productId", productId);
    formData.set("rating", String(rating));

    startTransition(async () => {
      const result = await submitReviewAction(formData);
      setMessage({ type: result.success ? "success" : "danger", text: result.message });
    });
  }

  return (
    <Form onSubmit={handleSubmit} className="border rounded p-3">
      <p className="fw-medium mb-2">Write a review</p>
      {message && <Alert variant={message.type} className="py-2">{message.text}</Alert>}

      <div className="d-flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <button type="button" key={n} onClick={() => setRating(n)} className="btn btn-link p-0 border-0" aria-label={`${n} stars`}>
            <Star size={22} fill={n <= rating ? "#f5a623" : "none"} stroke="#f5a623" />
          </button>
        ))}
      </div>

      <Form.Group className="mb-2">
        <Form.Control name="title" placeholder="Review title (optional)" />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Control as="textarea" name="comment" rows={3} placeholder="Share your thoughts on this product..." />
      </Form.Group>

      <Button type="submit" variant="primary" size="sm" disabled={rating === 0 || isPending}>
        {isPending ? "Submitting..." : "Submit review"}
      </Button>
    </Form>
  );
}
