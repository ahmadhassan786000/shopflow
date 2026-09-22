"use client";

import {
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Trash2,
  Pencil,
  X,
  Upload,
} from "lucide-react";

import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  removeCategoryImageAction,
} from "./actions";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
}

export function CategoryManager({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();

  const [
    message,
    setMessage,
  ] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);

  const [
    isPending,
    startTransition,
  ] = useTransition();

  const [
    editingId,
    setEditingId,
  ] = useState<string | null>(
    null,
  );

  function handleCreate(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    const form =
      e.currentTarget;

    const formData =
      new FormData(form);

    setMessage(null);

    startTransition(async () => {
      const result =
        await createCategoryAction(
          formData,
        );

      setMessage({
        type: result.success
          ? "success"
          : "danger",
        text: result.message,
      });

      if (result.success) {
        form.reset();
        router.refresh();
      }
    });
  }

  function handleUpdate(
    id: string,
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    const form =
      e.currentTarget;

    const formData =
      new FormData(form);

    setMessage(null);

    startTransition(async () => {
      const result =
        await updateCategoryAction(
          id,
          formData,
        );

      setMessage({
        type: result.success
          ? "success"
          : "danger",
        text: result.message,
      });

      if (result.success) {
        setEditingId(null);
        router.refresh();
      }
    });
  }

  function handleDelete(
    id: string,
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this category?",
      );

    if (!confirmed) {
      return;
    }

    setMessage(null);

    startTransition(async () => {
      const result =
        await deleteCategoryAction(
          id,
        );

      setMessage({
        type: result.success
          ? "success"
          : "danger",
        text: result.message,
      });

      router.refresh();
    });
  }

  function handleRemoveImage(
    id: string,
  ) {
    const confirmed =
      window.confirm(
        "Remove this category image?",
      );

    if (!confirmed) {
      return;
    }

    setMessage(null);

    startTransition(async () => {
      const result =
        await removeCategoryImageAction(
          id,
        );

      setMessage({
        type: result.success
          ? "success"
          : "danger",
        text: result.message,
      });

      router.refresh();
    });
  }

  return (
    <div>
      {/* GLOBAL MESSAGE */}
      {message && (
        <div
          className={`alert alert-${message.type} py-2 small`}
        >
          {message.text}
        </div>
      )}

      <div className="row g-4">
        {/* CREATE CATEGORY */}
        <div className="col-lg-5">
          <div className="bg-white border rounded-3 shadow-sm p-4">
            <h2 className="h6 fw-bold mb-1">
              New Category
            </h2>

            <p className="text-muted small mb-4">
              Create a category and
              optionally add an image URL.
            </p>

            <form
              onSubmit={handleCreate}

            >
              {/* NAME */}
              <div className="mb-3">
                <label
                  htmlFor="category-name"
                  className="form-label small fw-semibold"
                >
                  Name
                </label>

                <input
                  id="category-name"
                  name="name"
                  type="text"
                  placeholder="e.g. Electronics"
                  className="form-control"
                  required
                  disabled={isPending}
                />
              </div>

              {/* SLUG */}
              <div className="mb-3">
                <label
                  htmlFor="category-slug"
                  className="form-label small fw-semibold"
                >
                  Slug
                </label>

                <input
                  id="category-slug"
                  name="slug"
                  type="text"
                  placeholder="electronics"
                  className="form-control"
                  required
                  disabled={isPending}
                />

                <div className="form-text">
                  Use lowercase letters
                  and hyphens.
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="mb-3">
                <label
                  htmlFor="category-description"
                  className="form-label small fw-semibold"
                >
                  Description
                </label>

                <textarea
                  id="category-description"
                  name="description"
                  rows={3}
                  placeholder="Category description..."
                  className="form-control"
                  disabled={isPending}
                />
              </div>

              {/* PARENT */}
              <div className="mb-3">
                <label
                  htmlFor="category-parent"
                  className="form-label small fw-semibold"
                >
                  Parent Category
                </label>

                <select
                  id="category-parent"
                  name="parentId"
                  defaultValue=""
                  className="form-select"
                  disabled={isPending}
                >
                  <option value="">
                    No parent (top-level)
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={
                          category.id
                        }
                        value={
                          category.id
                        }
                      >
                        {
                          category.name
                        }
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* IMAGE URL */}
              <div className="mb-4">
                <label
                  htmlFor="category-image-url"
                  className="form-label small fw-semibold"
                >
                  Category Image URL
                </label>

                <input
                  id="category-image-url"
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/category.jpg"
                  className="form-control"
                  disabled={isPending}
                />

                <div className="form-text">
                  Use a direct HTTP or HTTPS image URL.
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={isPending}
              >
                <Upload
                  size={15}
                  className="me-1"
                />

                {isPending
                  ? "Creating..."
                  : "Create category"}
              </button>
            </form>
          </div>
        </div>

        {/* ALL CATEGORIES */}
        <div className="col-lg-7">
          <div className="bg-white border rounded-3 shadow-sm overflow-hidden">
            <div className="p-4 border-bottom">
              <h2 className="h6 fw-bold mb-1">
                All Categories
              </h2>

              <p className="text-muted small mb-0">
                {categories.length}{" "}
                {categories.length ===
                1
                  ? "category"
                  : "categories"}
              </p>
            </div>

            {categories.length ===
            0 ? (
              <div className="p-4">
                <p className="text-muted small mb-0">
                  No categories yet.
                </p>
              </div>
            ) : (
              <div>
                {categories.map(
                  (category) => {
                    const isEditing =
                      editingId ===
                      category.id;

                    if (isEditing) {
                      return (
                        <div
                          key={
                            category.id
                          }
                          className="p-4 border-bottom"
                        >
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="h6 fw-bold mb-0">
                              Edit Category
                            </h3>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                setEditingId(
                                  null,
                                )
                              }
                              disabled={
                                isPending
                              }
                            >
                              <X
                                size={
                                  15
                                }
                              />
                            </button>
                          </div>

                          <form
                            onSubmit={(
                              e,
                            ) =>
                              handleUpdate(
                                category.id,
                                e,
                              )
                            }
              
                          >
                            <div className="row g-3">
                              <div className="col-md-6">
                                <label className="form-label small fw-semibold">
                                  Name
                                </label>

                                <input
                                  name="name"
                                  type="text"
                                  defaultValue={
                                    category.name
                                  }
                                  className="form-control"
                                  required
                                  disabled={
                                    isPending
                                  }
                                />
                              </div>

                              <div className="col-md-6">
                                <label className="form-label small fw-semibold">
                                  Slug
                                </label>

                                <input
                                  name="slug"
                                  type="text"
                                  defaultValue={
                                    category.slug
                                  }
                                  className="form-control"
                                  required
                                  disabled={
                                    isPending
                                  }
                                />
                              </div>

                              <div className="col-12">
                                <label className="form-label small fw-semibold">
                                  Description
                                </label>

                                <textarea
                                  name="description"
                                  rows={3}
                                  defaultValue={
                                    category.description ??
                                    ""
                                  }
                                  className="form-control"
                                  disabled={
                                    isPending
                                  }
                                />
                              </div>

                              <div className="col-md-6">
                                <label className="form-label small fw-semibold">
                                  Parent Category
                                </label>

                                <select
                                  name="parentId"
                                  defaultValue={
                                    category.parentId ??
                                    ""
                                  }
                                  className="form-select"
                                  disabled={
                                    isPending
                                  }
                                >
                                  <option value="">
                                    No parent
                                  </option>

                                  {categories
                                    .filter(
                                      (
                                        item,
                                      ) =>
                                        item.id !==
                                        category.id,
                                    )
                                    .map(
                                      (
                                        item,
                                      ) => (
                                        <option
                                          key={
                                            item.id
                                          }
                                          value={
                                            item.id
                                          }
                                        >
                                          {
                                            item.name
                                          }
                                        </option>
                                      ),
                                    )}
                                </select>
                              </div>

                              <div className="col-md-6">
                                <label className="form-label small fw-semibold">
                                  Change Image URL
                                </label>

                                <input
                                  name="imageUrl"
                                  type="url"
                                  placeholder="https://example.com/category.jpg"
                                  className="form-control"
                                  disabled={
                                    isPending
                                  }
                                />

                                <div className="form-text">
                                  Leave empty to keep
                                  the current image.
                                </div>
                              </div>

                              {category.image && (
                                <div className="col-12">
                                  <div className="d-flex align-items-center gap-3">
                                    <div
                                      className="position-relative border rounded overflow-hidden"
                                      style={{
                                        width: 90,
                                        height: 70,
                                      }}
                                    >
                                      <Image
                                        src={
                                          category.image
                                        }
                                        alt={
                                          category.name
                                        }
                                        fill
                                        sizes="90px"
                                        style={{
                                          objectFit:
                                            "cover",
                                        }}
                                      />
                                    </div>

                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() =>
                                        handleRemoveImage(
                                          category.id,
                                        )
                                      }
                                      disabled={
                                        isPending
                                      }
                                    >
                                      <Trash2
                                        size={
                                          14
                                        }
                                        className="me-1"
                                      />
                                      Remove image
                                    </button>
                                  </div>
                                </div>
                              )}

                              <div className="col-12">
                                <div className="d-flex gap-2">
                                  <button
                                    type="submit"
                                    className="btn btn-primary btn-sm"
                                    disabled={
                                      isPending
                                    }
                                  >
                                    {isPending
                                      ? "Saving..."
                                      : "Save changes"}
                                  </button>

                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() =>
                                      setEditingId(
                                        null,
                                      )
                                    }
                                    disabled={
                                      isPending
                                    }
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={
                          category.id
                        }
                        className="p-3 border-bottom"
                      >
                        <div className="d-flex align-items-center gap-3">
                          {/* IMAGE */}
                          <div
                            className="position-relative border rounded overflow-hidden flex-shrink-0 bg-light"
                            style={{
                              width: 72,
                              height: 72,
                            }}
                          >
                            {category.image ? (
                              <Image
                                src={
                                  category.image
                                }
                                alt={
                                  category.name
                                }
                                fill
                                sizes="72px"
                                style={{
                                  objectFit:
                                    "cover",
                                }}
                              />
                            ) : (
                              <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted small">
                                No image
                              </div>
                            )}
                          </div>

                          {/* DETAILS */}
                          <div className="flex-grow-1 min-w-0">
                            <div className="fw-semibold">
                              {
                                category.name
                              }
                            </div>

                            <div className="text-muted small">
                              /
                              {
                                category.slug
                              }
                            </div>

                            {category.description && (
                              <div className="text-muted small text-truncate mt-1">
                                {
                                  category.description
                                }
                              </div>
                            )}
                          </div>

                          {/* ACTIONS */}
                          <div className="d-flex gap-2 flex-shrink-0">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                setEditingId(
                                  category.id,
                                )
                              }
                              disabled={
                                isPending
                              }
                              aria-label="Edit category"
                            >
                              <Pencil
                                size={
                                  15
                                }
                              />
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleDelete(
                                  category.id,
                                )
                              }
                              disabled={
                                isPending
                              }
                              aria-label="Delete category"
                            >
                              <Trash2
                                size={
                                  15
                                }
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}