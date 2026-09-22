"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Form, Button, Alert } from "react-bootstrap";
import { X } from "lucide-react";

import {
  addProductImageAction,
  removeProductImageAction,
} from "../../actions";

interface ImageItem {
  id: string;
  url: string;
  altText?: string | null;
}

interface ProductImageManagerProps {
  productId: string;
  images: ImageItem[];
}

export function ProductImageManager({
  productId,
  images,
}: ProductImageManagerProps) {
  const [url, setUrl] = useState("");

  const [message, setMessage] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);

  const [isPending, startTransition] =
    useTransition();

  function handleAddUrl(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    const imageUrl = url.trim();

    if (!imageUrl) {
      return;
    }

    try {
      const parsedUrl = new URL(imageUrl);

      if (
        parsedUrl.protocol !== "http:" &&
        parsedUrl.protocol !== "https:"
      ) {
        setMessage({
          type: "danger",
          text: "Please enter a valid HTTP or HTTPS image URL.",
        });
        return;
      }
    } catch {
      setMessage({
        type: "danger",
        text: "Please enter a valid image URL.",
      });
      return;
    }

    setMessage(null);

    startTransition(async () => {
      const result =
        await addProductImageAction(
          productId,
          imageUrl,
        );

      if (!result.success) {
        setMessage({
          type: "danger",
          text:
            result.message ??
            "Could not add image.",
        });
        return;
      }

      setUrl("");

      setMessage({
        type: "success",
        text:
          result.message ??
          "Image added successfully.",
      });
    });
  }

  function handleRemove(imageId: string) {
    setMessage(null);

    startTransition(async () => {
      await removeProductImageAction(
        imageId,
        productId,
      );

      setMessage({
        type: "success",
        text: "Image removed successfully.",
      });
    });
  }

  return (
    <div>
      {/* MESSAGE */}
      {message && (
        <Alert
          variant={message.type}
          className="small py-2"
        >
          {message.text}
        </Alert>
      )}

      {/* EXISTING IMAGES */}
      <div className="d-flex flex-wrap gap-3 mb-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="position-relative border rounded overflow-hidden"
            style={{
              width: 100,
              height: 100,
            }}
          >
            <Image
              src={img.url}
              alt={
                img.altText ??
                "Product image"
              }
              fill
              sizes="100px"
              style={{
                objectFit: "cover",
              }}
            />

            <button
              type="button"
              onClick={() =>
                handleRemove(img.id)
              }
              disabled={isPending}
              className="btn btn-sm btn-danger p-0 position-absolute top-0 end-0 rounded-circle"
              style={{
                width: 24,
                height: 24,
                lineHeight: 1,
                margin: 4,
              }}
              aria-label="Remove image"
            >
              <X size={13} />
            </button>
          </div>
        ))}

        {images.length === 0 && (
          <p className="text-muted small mb-0">
            No images yet.
          </p>
        )}
      </div>

      {/* ADD IMAGE BY URL */}
      <div className="border rounded p-3">
        <h3 className="h6 mb-3">
          Add image URL
        </h3>

        <Form
          onSubmit={handleAddUrl}
          className="d-flex gap-2"
        >
          <Form.Control
            size="sm"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={url}
            onChange={(e) =>
              setUrl(e.target.value)
            }
            disabled={isPending}
          />

          <Button
            size="sm"
            variant="outline-primary"
            type="submit"
            disabled={
              isPending || !url.trim()
            }
          >
            {isPending
              ? "Adding..."
              : "Add"}
          </Button>
        </Form>

        <Form.Text muted>
          Use a direct HTTP or HTTPS image URL.
        </Form.Text>
      </div>
    </div>
  );
}