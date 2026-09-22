"use client";

import { useState, useTransition } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Send } from "lucide-react";
import { submitContactMessage } from "./actions";

export function ContactForm() {
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await submitContactMessage(formData);
      setMessage({ type: result.success ? "success" : "danger", text: result.message });

      if (result.success) {
        form.reset();
      }
    });
  }

  return (
    <div className="shop-contact-form-card">
      <h2>Send us a message</h2>
      <p>Fill out the form and our team will reply within 24 hours.</p>

      {message && (
        <Alert variant={message.type} className="mt-3">
          {message.text}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} className="mt-3">
        <div className="shop-contact-form-row">
          <Form.Group className="mb-3">
            <Form.Label>Your name</Form.Label>
            <Form.Control name="name" placeholder="John Doe" required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control name="email" type="email" placeholder="you@example.com" required />
          </Form.Group>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Subject</Form.Label>
          <Form.Control name="subject" placeholder="Order question, product query..." required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control name="message" as="textarea" rows={5} placeholder="How can we help?" required />
        </Form.Group>

        <Button type="submit" disabled={isPending} className="shop-contact-submit">
          <Send size={16} />
          {isPending ? "Sending..." : "Send Message"}
        </Button>
      </Form>
    </div>
  );
}
