"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  Button,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import {
  createProductAction,
  updateProductAction,
} from "./actions";

export interface ProductFormValues {
  id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  brand?: string;
  categoryId: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
}

interface ProductFormProps {
  categories: {
    id: string;
    name: string;
  }[];
  initialValues?: ProductFormValues;
}

export function ProductForm({
  categories,
  initialValues,
}: ProductFormProps) {
  const router = useRouter();

  const [
    message,
    setMessage,
  ] = useState<{
    type: string;
    text: string;
  } | null>(null);

  const [
    isPending,
    startTransition,
  ] = useTransition();

  const isEdit =
    !!initialValues?.id;

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    const formData =
      new FormData(e.currentTarget);

    startTransition(async () => {
      const result = isEdit
        ? await updateProductAction(
            initialValues!.id!,
            formData,
          )
        : await createProductAction(
            formData,
          );

      if (
        result &&
        !result.success
      ) {
        setMessage({
          type: "danger",
          text: result.message,
        });
        return;
      }

      if (result?.success) {
        setMessage({
          type: "success",
          text: result.message,
        });

        router.refresh();
      }
    });
  }

  return (
    <Form onSubmit={handleSubmit}>
      {message && (
        <Alert variant={message.type}>
          {message.text}
        </Alert>
      )}

      <Row className="g-3">
        <Col md={8}>
          <Form.Group className="mb-3">
            <Form.Label>
              Name
            </Form.Label>

            <Form.Control
              name="name"
              defaultValue={
                initialValues?.name
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Slug
            </Form.Label>

            <Form.Control
              name="slug"
              defaultValue={
                initialValues?.slug
              }
              placeholder="e.g. iphone-15-pro"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Short description
            </Form.Label>

            <Form.Control
              name="shortDescription"
              defaultValue={
                initialValues?.shortDescription
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Description
            </Form.Label>

            <Form.Control
              as="textarea"
              rows={5}
              name="description"
              defaultValue={
                initialValues?.description
              }
              required
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>
              SKU
            </Form.Label>

            <Form.Control
              name="sku"
              defaultValue={
                initialValues?.sku
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Category
            </Form.Label>

            <Form.Select
              name="categoryId"
              defaultValue={
                initialValues?.categoryId
              }
              required
            >
              <option value="">
                Select category
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ),
              )}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Brand
            </Form.Label>

            <Form.Control
              name="brand"
              defaultValue={
                initialValues?.brand
              }
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>
                  Price
                </Form.Label>

                <Form.Control
                  type="number"
                  step="0.01"
                  name="price"
                  defaultValue={
                    initialValues?.price
                  }
                  required
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mb-3">
                <Form.Label>
                  Sale price
                </Form.Label>

                <Form.Control
                  type="number"
                  step="0.01"
                  name="salePrice"
                  defaultValue={
                    initialValues?.salePrice ??
                    ""
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>
              Stock
            </Form.Label>

            <Form.Control
              type="number"
              name="stock"
              defaultValue={
                initialValues?.stock ?? 0
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Status
            </Form.Label>

            <Form.Select
              name="status"
              defaultValue={
                initialValues?.status ??
                "DRAFT"
              }
            >
              <option value="DRAFT">
                Draft
              </option>

              <option value="PUBLISHED">
                Published
              </option>

              <option value="ARCHIVED">
                Archived
              </option>
            </Form.Select>
          </Form.Group>

          <Form.Check
            type="checkbox"
            name="isFeatured"
            label="Featured product"
            defaultChecked={
              initialValues?.isFeatured
            }
            className="mb-3"
          />

          {/* =====================================================
              PRODUCT IMAGE URL
          ====================================================== */}

          {!isEdit && (
            <Form.Group className="mb-3">
              <Form.Label>
                Product image URL
              </Form.Label>

              <Form.Control
                type="url"
                name="imageUrl"
                placeholder="https://example.com/product.jpg"
              />

              <Form.Text muted>
                Use a direct HTTP or HTTPS
                image URL. You can add more
                images after creating the product.
              </Form.Text>
            </Form.Group>
          )}
        </Col>
      </Row>

      <Button
        type="submit"
        variant="primary"
        disabled={isPending}
      >
        {isPending
          ? "Saving..."
          : isEdit
            ? "Save changes"
            : "Create product"}
      </Button>
    </Form>
  );
}