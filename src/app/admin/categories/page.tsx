import { getAllCategoriesFlat } from "@/services/categoryService";
import { CategoryManager } from "./CategoryManager";

export const metadata = {
  title: "Manage Categories",
};

export default async function AdminCategoriesPage() {
  const categories =
    await getAllCategoriesFlat();

  return (
    <>
      <h1 className="h4 fw-bold mb-1">
        Categories
      </h1>

      <p className="text-muted small mb-4">
        Create, edit and manage your
        product categories and images.
      </p>

      <CategoryManager
        categories={categories}
      />
    </>
  );
}