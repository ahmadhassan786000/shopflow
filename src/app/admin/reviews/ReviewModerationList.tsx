"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Badge } from "react-bootstrap";
import { Star, Check, X, Trash2 } from "lucide-react";
import { moderateReviewAction, deleteReviewAction } from "./actions";
import { EmptyState } from "@/components/ui/Pagination";

interface Review {
  id: string; rating: number; title: string | null; comment: string | null;
  status: string; userName: string; productName: string; createdAt: string;
}

const STATUS_VARIANT: Record<string, string> = { PENDING: "secondary", APPROVED: "success", REJECTED: "danger" };

export function ReviewModerationList({ reviews }: { reviews: Review[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function moderate(id: string, status: "APPROVED" | "REJECTED") {
    startTransition(async () => {
      await moderateReviewAction(id, status);
      router.refresh();
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      await deleteReviewAction(id);
      router.refresh();
    });
  }

  if (reviews.length === 0) return <EmptyState title="No reviews yet" />;

  return (
    <div className="d-flex flex-column gap-3">
      {reviews.map((review) => (
        <Card key={review.id} className="border-0 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <strong>{review.userName}</strong>
                  <span className="text-muted small">on {review.productName}</span>
                  <Badge bg={STATUS_VARIANT[review.status]}>{review.status}</Badge>
                </div>
                <div className="d-flex gap-1 mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={14} fill={i < review.rating ? "#f5a623" : "none"} stroke="#f5a623" />
                  ))}
                </div>
                {review.title && <p className="fw-medium mb-1">{review.title}</p>}
                {review.comment && <p className="small text-muted mb-0">{review.comment}</p>}
              </div>
              <div className="d-flex gap-2">
                {review.status !== "APPROVED" && (
                  <Button size="sm" variant="outline-success" onClick={() => moderate(review.id, "APPROVED")} disabled={isPending} aria-label="Approve">
                    <Check size={14} />
                  </Button>
                )}
                {review.status !== "REJECTED" && (
                  <Button size="sm" variant="outline-warning" onClick={() => moderate(review.id, "REJECTED")} disabled={isPending} aria-label="Reject">
                    <X size={14} />
                  </Button>
                )}
                <Button size="sm" variant="outline-danger" onClick={() => remove(review.id)} disabled={isPending} aria-label="Delete">
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
