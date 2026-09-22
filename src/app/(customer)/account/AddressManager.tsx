"use client";

import { useState, useTransition } from "react";
import {
  Alert,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import {
  CheckCircle2,
  Edit3,
  MapPin,
  X,
} from "lucide-react";

import {
  deleteAddressAction,
  updateAddressAction,
} from "./actions";

interface Address {
  id: string;
  type: "SHIPPING" | "BILLING";
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface AddressManagerProps {
  addresses: Address[];
}

export function AddressManager({
  addresses,
}: AddressManagerProps) {
  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  const [message, setMessage] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);

  const [isPending, startTransition] =
    useTransition();

  const editingAddress = addresses.find(
    (address) => address.id === editingId,
  );

  function handleAddressClick(address: Address) {
    setMessage(null);
    setEditingId(address.id);
  }

  function handleUpdate(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result =
        await updateAddressAction(formData);

      setMessage({
        type: result.success ? "success" : "danger",
        text: result.message,
      });

      if (result.success) {
        setEditingId(null);
      }
    });
  }

  function handleDelete() {
    if (!deleteId) {
      return;
    }

    const id = deleteId;

    startTransition(async () => {
      const result =
        await deleteAddressAction(id);

      setMessage({
        type: result.success ? "success" : "danger",
        text: result.message,
      });

      if (result.success) {
        setDeleteId(null);
      }
    });
  }

  if (addresses.length === 0) {
    return (
      <div className="shop-account-empty-address">
        <strong>No saved addresses.</strong>
        <p>Add one during checkout.</p>
      </div>
    );
  }

  return (
    <>
      {message && (
        <Alert
          variant={message.type}
          dismissible
          onClose={() => setMessage(null)}
          className="mb-4"
        >
          {message.text}
        </Alert>
      )}

      <div className="shop-address-grid">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`shop-address-card ${
              address.isDefault ? "default" : ""
            }`}
            role="button"
            tabIndex={0}
            onClick={() =>
              handleAddressClick(address)
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter" ||
                event.key === " "
              ) {
                event.preventDefault();
                handleAddressClick(address);
              }
            }}
            aria-label={`Edit address for ${address.fullName}`}
          >
            <div className="shop-address-card-top">
              <div className="shop-address-icon">
                <MapPin size={18} />
              </div>

              <div className="shop-address-card-actions">
                {address.isDefault && (
                  <span
                    className="shop-address-selected"
                    title="Default address"
                  >
                    <CheckCircle2 size={16} />
                  </span>
                )}

                <button
                  type="button"
                  className="shop-address-remove"
                  aria-label={`Remove address for ${address.fullName}`}
                  title="Remove address"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setDeleteId(address.id);
                  }}
                  disabled={isPending}
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            <div className="shop-address-card-body">
              <div className="shop-address-name-row">
                <h3>{address.fullName}</h3>

                {address.isDefault && (
                  <span className="shop-default-badge">
                    Default
                  </span>
                )}
              </div>

              <p>
                {address.line1}

                {address.line2 && (
                  <>
                    <br />
                    {address.line2}
                  </>
                )}

                <br />

                {address.city}, {address.state}{" "}
                {address.postalCode}

                <br />

                {address.country}
              </p>

              <span className="shop-address-edit-hint">
                <Edit3 size={11} />
                Click to edit
              </span>
            </div>
          </div>
        ))}
      </div>

      {editingAddress && (
        <Modal
          show
          onHide={() => setEditingId(null)}
          centered
          size="lg"
        >
          <Form onSubmit={handleUpdate}>
            <Modal.Header closeButton>
              <Modal.Title>
                Edit Address
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <input
                type="hidden"
                name="id"
                value={editingAddress.id}
              />

              <input
                type="hidden"
                name="type"
                value={editingAddress.type}
              />

              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Full name</Form.Label>
                    <Form.Control
                      name="fullName"
                      defaultValue={
                        editingAddress.fullName
                      }
                      required
                    />
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      name="phone"
                      defaultValue={
                        editingAddress.phone
                      }
                      required
                    />
                  </Form.Group>
                </div>

                <div className="col-12">
                  <Form.Group>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      name="line1"
                      defaultValue={
                        editingAddress.line1
                      }
                      required
                    />
                  </Form.Group>
                </div>

                <div className="col-12">
                  <Form.Group>
                    <Form.Label>
                      Address line 2
                    </Form.Label>
                    <Form.Control
                      name="line2"
                      defaultValue={
                        editingAddress.line2 ?? ""
                      }
                    />
                  </Form.Group>
                </div>

                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      name="city"
                      defaultValue={
                        editingAddress.city
                      }
                      required
                    />
                  </Form.Group>
                </div>

                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      name="state"
                      defaultValue={
                        editingAddress.state
                      }
                      required
                    />
                  </Form.Group>
                </div>

                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>
                      Postal code
                    </Form.Label>
                    <Form.Control
                      name="postalCode"
                      defaultValue={
                        editingAddress.postalCode
                      }
                      required
                    />
                  </Form.Group>
                </div>

                <div className="col-md-8">
                  <Form.Group>
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                      name="country"
                      defaultValue={
                        editingAddress.country
                      }
                      required
                    />
                  </Form.Group>
                </div>

                <div className="col-md-4 d-flex align-items-end">
                  <Form.Check
                    type="checkbox"
                    name="isDefault"
                    value="true"
                    label="Make default address"
                    defaultChecked={
                      editingAddress.isDefault
                    }
                  />
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button
                type="button"
                variant="light"
                onClick={() =>
                  setEditingId(null)
                }
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
                  : "Save Address"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}

      <Modal
        show={Boolean(deleteId)}
        onHide={() => setDeleteId(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Remove Address
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="mb-0">
            Are you sure you want to remove this
            saved address? This action cannot be
            undone.
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            variant="light"
            onClick={() => setDeleteId(null)}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending
              ? "Removing..."
              : "Remove Address"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
