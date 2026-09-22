import { getAllCategoriesFlat } from "@/services/categoryService";
import { ProductForm } from "../ProductForm";

export const metadata = { title: "New Product" };

export default async function NewProductPage() {
  const categories = await getAllCategoriesFlat();
  return (
    <>
      <h1 className="h4 fw-bold mb-4">New Product</h1>
      <ProductForm categories={categories} />
    </>
  );
}
