import { notFound } from "next/navigation";
import { Card, Row, Col } from "react-bootstrap";
import { getProductById } from "@/services/productService";
import { getAllCategoriesFlat } from "@/services/categoryService";
import { ProductForm } from "../../ProductForm";
import { ProductImageManager } from "./ProductImageManager";
import { ProductVariantManager } from "./ProductVariantManager";

export const metadata = {
  title: "Edit Product",
};

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    getProductById(params.id),
    getAllCategoriesFlat(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <>
      <h1 className="h4 fw-bold mb-4">
        Edit Product
      </h1>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <div className="card-body">
              <ProductForm
                categories={categories}
                initialValues={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  description: product.description,
                  shortDescription:
                    product.shortDescription ?? "",
                  sku: product.sku,
                  price: Number(product.price),
                  salePrice: product.salePrice
                    ? Number(product.salePrice)
                    : null,
                  stock: product.stock,
                  brand: product.brand ?? "",
                  categoryId: product.categoryId,
                  status: product.status,
                  isFeatured: product.isFeatured,
                }}
              />
            </div>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-4">
            <div className="card-body">
              <h2 className="h6 mb-3">
                Images
              </h2>

              <ProductImageManager
                productId={product.id}
                images={product.images}
              />
            </div>
          </Card>

          <Card className="border-0 shadow-sm">
            <div className="card-body">
              <h2 className="h6 mb-3">
                Variants
              </h2>

              <ProductVariantManager
                productId={product.id}
                variants={product.variants}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}