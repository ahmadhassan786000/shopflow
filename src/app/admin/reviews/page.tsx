import { getReviewsForAdmin } from "@/services/reviewService";
import { ReviewModerationList } from "./ReviewModerationList";

export const metadata = { title: "Manage Reviews" };

export default async function AdminReviewsPage() {
  const reviews = await getReviewsForAdmin();
  return (
    <>
      <h1 className="h4 fw-bold mb-4">Reviews</h1>
      <ReviewModerationList
        reviews={reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          status: r.status,
          userName: r.user.name,
          productName: r.product.name,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </>
  );
}
