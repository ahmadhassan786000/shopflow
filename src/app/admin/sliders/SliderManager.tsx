"use client";

import Image from "next/image";
import {
  useState,
  useTransition,
} from "react";
import {
  Alert,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import {
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

import {
  createSliderAction,
  updateSliderAction,
  deleteSliderAction,
  removeSliderImageAction,
} from "./actions";

export interface SliderData {
  id: string;
  title: string;
  description: string | null;
  image: string;
  buttonText: string | null;
  buttonUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

interface SliderManagerProps {
  sliders: SliderData[];
}

const emptyForm = {
  title: "",
  description: "",
  buttonText: "Shop Now",
  buttonUrl: "/products",
  imageUrl: "",
  isActive: true,
  sortOrder: 0,
};

export function SliderManager({
  sliders,
}: SliderManagerProps) {
  const [
    isPending,
    startTransition,
  ] = useTransition();

  const [showModal, setShowModal] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<{
      type: "success" | "danger";
      text: string;
    } | null>(null);

  const editingSlider =
    sliders.find(
      (slider) =>
        slider.id === editingId,
    );

  function openCreate() {
    setEditingId(null);
    setMessage(null);
    setShowModal(true);
  }

  function openEdit(
    slider: SliderData,
  ) {
    setEditingId(slider.id);
    setMessage(null);
    setShowModal(true);
  }

  function closeModal() {
    if (!isPending) {
      setShowModal(false);
      setEditingId(null);
      setMessage(null);
    }
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const formData =
      new FormData(
        event.currentTarget,
      );

    startTransition(async () => {
      const result = editingId
        ? await updateSliderAction(
            editingId,
            formData,
          )
        : await createSliderAction(
            formData,
          );

      if (!result.success) {
        setMessage({
          type: "danger",
          text: result.message,
        });

        return;
      }

      setMessage({
        type: "success",
        text: result.message,
      });

      setShowModal(false);
      setEditingId(null);

      window.location.reload();
    });
  }

  function handleDelete(
    id: string,
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this slider?",
      );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result =
        await deleteSliderAction(id);

      if (!result.success) {
        setMessage({
          type: "danger",
          text: result.message,
        });

        return;
      }

      setMessage({
        type: "success",
        text: result.message,
      });

      window.location.reload();
    });
  }

  function handleRemoveImage(
    id: string,
  ) {
    const confirmed =
      window.confirm(
        "Remove this slider image?",
      );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result =
        await removeSliderImageAction(
          id,
        );

      if (!result.success) {
        setMessage({
          type: "danger",
          text: result.message,
        });

        return;
      }

      setMessage({
        type: "success",
        text: result.message,
      });

      window.location.reload();
    });
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">
            Sliders
          </h1>

          <p className="text-muted mb-0">
            Manage homepage promotional sliders.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreate}
          disabled={isPending}
        >
          <Plus
            size={17}
            className="me-2"
          />
          Add Slider
        </Button>
      </div>

      {message && (
        <Alert
          variant={message.type}
          dismissible
          onClose={() =>
            setMessage(null)
          }
        >
          {message.text}
        </Alert>
      )}

      <div className="card border-0 shadow-sm">
        {sliders.length === 0 ? (
          <div className="p-5 text-center">
            <h5 className="fw-semibold">
              No sliders yet
            </h5>

            <p className="text-muted mb-3">
              Create your first homepage slider.
            </p>

            <Button
              variant="primary"
              onClick={openCreate}
            >
              <Plus
                size={17}
                className="me-2"
              />
              Add Slider
            </Button>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {sliders.map(
              (slider) => (
                <div
                  key={slider.id}
                  className="list-group-item p-3"
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="position-relative overflow-hidden rounded border flex-shrink-0 bg-light"
                      style={{
                        width: 150,
                        height: 85,
                      }}
                    >
                      {slider.image ? (
                        <Image
                          src={
                            slider.image
                          }
                          alt={
                            slider.title
                          }
                          fill
                          sizes="150px"
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

                    <div className="flex-grow-1 min-w-0">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <h5 className="fw-semibold mb-0">
                          {
                            slider.title
                          }
                        </h5>

                        <span
                          className={`badge ${
                            slider.isActive
                              ? "text-bg-success"
                              : "text-bg-secondary"
                          }`}
                        >
                          {slider.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>

                      {slider.description && (
                        <p className="text-muted small mb-1 text-truncate">
                          {
                            slider.description
                          }
                        </p>
                      )}

                      <div className="small text-muted">
                        Order:{" "}
                        {
                          slider.sortOrder
                        }

                        {slider.buttonText && (
                          <>
                            {" "}
                            • Button:{" "}
                            {
                              slider.buttonText
                            }
                          </>
                        )}
                      </div>
                    </div>

                    <div className="d-flex gap-2 flex-shrink-0">
                      {slider.image && (
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() =>
                            handleRemoveImage(
                              slider.id,
                            )
                          }
                          disabled={
                            isPending
                          }
                          title="Remove image"
                        >
                          <Trash2
                            size={15}
                          />
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() =>
                          openEdit(
                            slider,
                          )
                        }
                        disabled={
                          isPending
                        }
                        title="Edit slider"
                      >
                        <Pencil
                          size={15}
                        />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() =>
                          handleDelete(
                            slider.id,
                          )
                        }
                        disabled={
                          isPending
                        }
                        title="Delete slider"
                      >
                        <Trash2
                          size={15}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      <Modal
        show={showModal}
        onHide={closeModal}
        centered
        size="lg"
      >
        <Form
          onSubmit={handleSubmit}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingSlider
                ? "Edit Slider"
                : "Add Slider"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="row g-3">
              <div className="col-md-8">
                <Form.Group>
                  <Form.Label>
                    Title
                  </Form.Label>

                  <Form.Control
                    name="title"
                    type="text"
                    defaultValue={
                      editingSlider?.title ??
                      emptyForm.title
                    }
                    placeholder="Everything you need, delivered fast"
                    required
                    disabled={
                      isPending
                    }
                  />
                </Form.Group>
              </div>

              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>
                    Sort Order
                  </Form.Label>

                  <Form.Control
                    name="sortOrder"
                    type="number"
                    min={0}
                    defaultValue={
                      editingSlider?.sortOrder ??
                      emptyForm.sortOrder
                    }
                    disabled={
                      isPending
                    }
                  />
                </Form.Group>
              </div>

              <div className="col-12">
                <Form.Group>
                  <Form.Label>
                    Description
                  </Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    defaultValue={
                      editingSlider?.description ??
                      emptyForm.description
                    }
                    placeholder="Shop thousands of products across every category."
                    disabled={
                      isPending
                    }
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>
                    Button Text
                  </Form.Label>

                  <Form.Control
                    name="buttonText"
                    type="text"
                    defaultValue={
                      editingSlider?.buttonText ??
                      emptyForm.buttonText
                    }
                    placeholder="Shop Now"
                    disabled={
                      isPending
                    }
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>
                    Button URL
                  </Form.Label>

                  <Form.Control
                    name="buttonUrl"
                    type="text"
                    defaultValue={
                      editingSlider?.buttonUrl ??
                      emptyForm.buttonUrl
                    }
                    placeholder="/products"
                    disabled={
                      isPending
                    }
                  />
                </Form.Group>
              </div>

              <div className="col-12">
                <Form.Group>
                  <Form.Label>
                    Image URL
                  </Form.Label>

                  <Form.Control
                    name="imageUrl"
                    type="url"
                    defaultValue={
                      editingSlider?.image ??
                      emptyForm.imageUrl
                    }
                    placeholder="https://example.com/slider-banner.jpg"
                    required
                    disabled={
                      isPending
                    }
                  />

                  <Form.Text muted>
                    Enter a direct HTTP or HTTPS
                    image URL. Recommended banner
                    ratio: 16:5.
                  </Form.Text>
                </Form.Group>
              </div>

              {editingSlider?.image && (
                <div className="col-12">
                  <div
                    className="position-relative overflow-hidden rounded border"
                    style={{
                      height: 180,
                    }}
                  >
                    <Image
                      src={
                        editingSlider.image
                      }
                      alt={
                        editingSlider.title
                      }
                      fill
                      sizes="(max-width: 768px) 100vw, 700px"
                      style={{
                        objectFit:
                          "cover",
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="col-12">
                <Form.Check
                  type="checkbox"
                  name="isActive"
                  label="Show this slider on the homepage"
                  defaultChecked={
                    editingSlider?.isActive ??
                    emptyForm.isActive
                  }
                  disabled={
                    isPending
                  }
                />
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={closeModal}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={isPending}
            >
              {isPending
                ? "Saving..."
                : editingSlider
                  ? "Save Changes"
                  : "Create Slider"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}