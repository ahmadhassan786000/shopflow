"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, Form, Button, Row, Col, Alert, Badge } from "react-bootstrap";
import { Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { createCouponAction, deleteCouponAction } from "./actions";

interface Coupon {
  id: string; code: string; discountType: string; value: number;
  usageCount: number; usageLimit: number | null; expiresAt: string | null; isActive: boolean;
}

export function CouponManager({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createCouponAction(formData);
      setMessage({ type: result.success ? "success" : "danger", text: result.message });
      if (result.success) {
        e.currentTarget.reset();
        router.refresh();
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteCouponAction(id);
      router.refresh();
    });
  }

  return (
    <Row className="g-4">
      <Col md={5}>
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <Card.Title className="h6 mb-3">New Coupon</Card.Title>
            {message && <Alert variant={message.type} className="py-2">{message.text}</Alert>}
            <Form onSubmit={handleCreate}>
              <Form.Group className="mb-2">
                <Form.Control name="code" placeholder="CODE (e.g. SAVE10)" required />
              </Form.Group>
              <Row className="g-2 mb-2">
                <Col>
                  <Form.Select name="discountType" defaultValue="PERCENTAGE">
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FIXED">Fixed amount</option>
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Control type="number" step="0.01" name="value" placeholder="Value" required />
                </Col>
              </Row>
              <Row className="g-2 mb-2">
                <Col><Form.Control type="number" step="0.01" name="minOrderAmount" placeholder="Min order (optional)" /></Col>
                <Col><Form.Control type="number" name="usageLimit" placeholder="Usage limit (optional)" /></Col>
              </Row>
              <Form.Group className="mb-2">
                <Form.Label className="small text-muted">Expires (optional)</Form.Label>
                <Form.Control type="date" name="expiresAt" />
              </Form.Group>
              <Form.Check type="checkbox" name="isActive" label="Active" defaultChecked className="mb-3" />
              <Button type="submit" variant="primary" size="sm" disabled={isPending}>Create coupon</Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>

      <Col md={7}>
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <Card.Title className="h6 mb-3">All Coupons</Card.Title>
            {coupons.length === 0 ? (
              <p className="text-muted small">No coupons yet.</p>
            ) : (
              <ul className="list-group list-group-flush">
                {coupons.map((c) => (
                  <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <div>
                      <strong>{c.code}</strong>{" "}
                      <span className="small text-muted">
                        {c.discountType === "PERCENTAGE"
                          ? `${c.value}%`
                          : formatCurrency(c.value)} off
                        {c.usageLimit ? ` · ${c.usageCount}/${c.usageLimit} used` : ""}
                      </span>{" "}
                      {c.isActive ? <Badge bg="success">Active</Badge> : <Badge bg="secondary">Inactive</Badge>}
                    </div>
                    <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(c.id)} aria-label="Delete coupon">
                      <Trash2 size={16} />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
