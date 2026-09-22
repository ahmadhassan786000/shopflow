"use client";

import { useState, useTransition } from "react";
import {
  MapPin,
  Plus,
  CheckCircle2,
  Banknote,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  UserRound,
  Phone,
  X,
  Edit3,
} from "lucide-react";
import {
  Form,
  Alert,
  Modal,
  Button,
} from "react-bootstrap";
import { formatCurrency } from "@/lib/utils";
import {
  placeOrderAction,
  saveAddressAction,
  updateCheckoutAddressAction,
  deleteCheckoutAddressAction,
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

interface CheckoutFormProps {
  addresses: Address[];
  subtotal: number;
}

const SHIPPING_CHARGE = 180;

export function CheckoutForm({
  addresses,
  subtotal,
}: CheckoutFormProps) {
  const [shippingAddressId, setShippingAddressId] =
    useState(addresses[0]?.id ?? "");

  const [showAddressForm, setShowAddressForm] =
    useState(addresses.length === 0);

  const [editingAddress, setEditingAddress] =
    useState<Address | null>(null);

  const [removingAddressId, setRemovingAddressId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  const [savedAddresses, setSavedAddresses] =
    useState<Address[]>(addresses);

  const [isPending, startTransition] =
    useTransition();

  const estimatedTotal =
    subtotal + SHIPPING_CHARGE;

  function handleAddAddress(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    setMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    formData.set("type", "SHIPPING");

    startTransition(async () => {
      const result =
        await saveAddressAction(formData);

      if (!result.success || !result.address) {
        setMessage(result.message);
        return;
      }

      const newAddress: Address =
        result.address;

      setSavedAddresses((prev) => [
        newAddress,
        ...prev,
      ]);

      setShippingAddressId(
        newAddress.id,
      );

      setShowAddressForm(false);
      setMessage(null);

      form.reset();
    });
  }

  function handleAddressClick(
    address: Address,
  ) {
    setMessage(null);

    // Clicking the address card opens edit.
    setEditingAddress(address);
  }

  function handleUpdateAddress(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    setMessage(null);

    const formData = new FormData(
      e.currentTarget,
    );

    formData.set("type", "SHIPPING");

    startTransition(async () => {
      const result =
        await updateCheckoutAddressAction(
          formData,
        );

      if (!result.success || !result.address) {
        setMessage(result.message);
        return;
      }

      const updatedAddress: Address =
        result.address;

      setSavedAddresses((prev) =>
        prev.map((address) => {
          if (address.id === updatedAddress.id) {
            return updatedAddress;
          }

          if (updatedAddress.isDefault) {
            return {
              ...address,
              isDefault: false,
            };
          }

          return address;
        }),
      );

      setEditingAddress(null);
      setMessage(null);
    });
  }

  function handleRemoveAddress() {
    if (!removingAddressId) {
      return;
    }

    const addressId =
      removingAddressId;

    setMessage(null);

    startTransition(async () => {
      const result =
        await deleteCheckoutAddressAction(
          addressId,
        );

      if (!result.success) {
        setMessage(result.message);
        setRemovingAddressId(null);
        return;
      }

      setSavedAddresses((prev) =>
        prev.filter(
          (address) =>
            address.id !== addressId,
        ),
      );

      if (shippingAddressId === addressId) {
        const remaining =
          savedAddresses.filter(
            (address) =>
              address.id !== addressId,
          );

        setShippingAddressId(
          remaining[0]?.id ?? "",
        );
      }

      setRemovingAddressId(null);
      setMessage(null);
    });
  }

  function handlePlaceOrder() {
    setMessage(null);

    const formData = new FormData();

    formData.set(
      "shippingAddressId",
      shippingAddressId,
    );

    formData.set(
      "billingAddressId",
      shippingAddressId,
    );

    startTransition(async () => {
      const result =
        await placeOrderAction(formData);

      if (result && !result.success) {
        setMessage(result.message);
      }
    });
  }

  return (
    <div className="shop-checkout">

      {message && (
        <Alert
          variant="danger"
          className="shop-checkout-alert"
          dismissible
          onClose={() => setMessage(null)}
        >
          {message}
        </Alert>
      )}

      <div className="shop-checkout-layout">

        <div className="shop-checkout-main">

          <section className="shop-checkout-card">

            <div className="shop-checkout-card-header">
              <div className="shop-checkout-step">
                01
              </div>

              <div>
                <span className="shop-checkout-eyebrow">
                  DELIVERY
                </span>

                <h2>Shipping address</h2>

                <p>
                  Where should we deliver your order?
                </p>
              </div>
            </div>

            {savedAddresses.length > 0 && (
              <div className="shop-checkout-address-grid">

                {savedAddresses.map(
                  (address) => {
                    const selected =
                      shippingAddressId ===
                      address.id;

                    return (
                      <div
                        key={address.id}
                        className={`shop-checkout-address ${
                          selected
                            ? "selected"
                            : ""
                        }`}
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          handleAddressClick(
                            address,
                          )
                        }
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" ||
                            e.key === " "
                          ) {
                            e.preventDefault();

                            handleAddressClick(
                              address,
                            );
                          }
                        }}
                        aria-label={`Edit address for ${address.fullName}`}
                      >

                        <div className="shop-checkout-address-top">

                          <div className="shop-checkout-address-icon">
                            <MapPin size={18} />
                          </div>

                          <div className="shop-checkout-address-actions">
  {selected && (
    <span
      className="shop-checkout-selected"
      title="Selected address"
    >
      <CheckCircle2 size={17} />
    </span>
  )}

  <button
    type="button"
    className="shop-checkout-address-remove"
    aria-label={`Remove address for ${address.fullName}`}
    title="Remove address"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();

      setRemovingAddressId(address.id);
    }}
  >
    <X size={15} />
  </button>
</div>

                        </div>

                        <div className="shop-checkout-address-content">

                          <h3>
                            {address.fullName}
                          </h3>

                          <p>
                            {address.line1}

                            {address.line2 && (
                              <>
                                <br />
                                {address.line2}
                              </>
                            )}

                            <br />

                            {address.city},{" "}
                            {address.state}{" "}
                            {address.postalCode}

                            <br />

                            {address.country}
                          </p>

                          <span className="shop-checkout-address-edit-hint">
                            <Edit3 size={11} />
                            Click to edit
                          </span>

                        </div>

                      </div>
                    );
                  },
                )}

              </div>
            )}

            {!showAddressForm ? (
              <button
                type="button"
                className="shop-checkout-add-address"
                onClick={() =>
                  setShowAddressForm(true)
                }
              >
                <Plus size={17} />
                <span>Add new address</span>
              </button>
            ) : (
              <div className="shop-checkout-new-address">

                <div className="shop-checkout-new-address-heading">
                  <h3>Add a new address</h3>

                  <p>
                    Enter your delivery details below.
                  </p>
                </div>

                <Form
                  onSubmit={handleAddAddress}
                >

                  <div className="shop-checkout-form-grid">

                    <div className="shop-checkout-field">
                      <Form.Label>
                        <UserRound size={14} />
                        Full name
                      </Form.Label>

                      <Form.Control
                        name="fullName"
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="shop-checkout-field">
                      <Form.Label>
                        <Phone size={14} />
                        Phone
                      </Form.Label>

                      <Form.Control
                        name="phone"
                        placeholder="03XX XXXXXXX"
                        required
                      />
                    </div>

                    <div className="shop-checkout-field full">
                      <Form.Label>
                        <MapPin size={14} />
                        Address
                      </Form.Label>

                      <Form.Control
                        name="line1"
                        placeholder="House / street / area"
                        required
                      />
                    </div>

                    <div className="shop-checkout-field full">
                      <Form.Label>
                        Address line 2
                        <span>(optional)</span>
                      </Form.Label>

                      <Form.Control
                        name="line2"
                        placeholder="Apartment, floor, landmark"
                      />
                    </div>

                    <div className="shop-checkout-field">
                      <Form.Label>City</Form.Label>

                      <Form.Control
                        name="city"
                        placeholder="City"
                        required
                      />
                    </div>

                    <div className="shop-checkout-field">
                      <Form.Label>
                        State / Province
                      </Form.Label>

                      <Form.Control
                        name="state"
                        placeholder="State"
                        required
                      />
                    </div>

                    <div className="shop-checkout-field">
                      <Form.Label>
                        Postal code
                      </Form.Label>

                      <Form.Control
                        name="postalCode"
                        placeholder="Postal code"
                        required
                      />
                    </div>

                    <div className="shop-checkout-field">
                      <Form.Label>Country</Form.Label>

                      <Form.Control
                        name="country"
                        placeholder="Country"
                        required
                      />
                    </div>

                  </div>

                  <div className="shop-checkout-form-actions">

                    {savedAddresses.length > 0 && (
                      <button
                        type="button"
                        className="shop-checkout-cancel"
                        onClick={() =>
                          setShowAddressForm(false)
                        }
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      type="submit"
                      className="shop-checkout-save"
                      disabled={isPending}
                    >
                      <MapPin size={16} />

                      {isPending
                        ? "Saving..."
                        : "Save address"}
                    </button>

                  </div>

                </Form>
              </div>
            )}

          </section>

          <section className="shop-checkout-card">

            <div className="shop-checkout-card-header">
              <div className="shop-checkout-step">
                02
              </div>

              <div>
                <span className="shop-checkout-eyebrow">
                  PAYMENT
                </span>

                <h2>Payment method</h2>

                <p>
                  Choose how you want to pay for your order.
                </p>
              </div>
            </div>

            <div className="shop-checkout-payment selected">

              <div className="shop-checkout-payment-icon">
                <Banknote size={25} />
              </div>

              <div className="shop-checkout-payment-content">

                <div className="shop-checkout-payment-title">
                  <h3>Cash on Delivery</h3>
                  <span>Available</span>
                </div>

                <p>
                  Pay in cash when your order is delivered
                  to your doorstep.
                </p>

              </div>

              <CheckCircle2
                size={20}
                className="shop-checkout-payment-check"
              />

            </div>

            <div className="shop-checkout-payment-note">
              <ShieldCheck size={16} />

              <span>
                Your order will be confirmed before dispatch.
              </span>
            </div>

          </section>

        </div>

        <aside className="shop-checkout-sidebar">

          <div className="shop-checkout-summary">

            <div className="shop-checkout-summary-header">
              <div className="shop-checkout-summary-icon">
                <ShoppingBag size={19} />
              </div>

              <div>
                <span>ORDER SUMMARY</span>
                <h2>Your order</h2>
              </div>
            </div>

            <div className="shop-checkout-summary-lines">

              <div>
                <span>Subtotal</span>

                <strong>
                  {formatCurrency(subtotal)}
                </strong>
              </div>

              <div>
                <span>Shipping</span>

                <strong>
                  {formatCurrency(SHIPPING_CHARGE)}
                </strong>
              </div>

            </div>

            <div className="shop-checkout-total">

              <div>
                <span>Total</span>
                <small>Including shipping</small>
              </div>

              <strong>
                {formatCurrency(estimatedTotal)}
              </strong>

            </div>

            <button
              type="button"
              className="shop-checkout-place-order"
              disabled={
                !shippingAddressId ||
                isPending
              }
              onClick={handlePlaceOrder}
            >
              <span>
                {isPending
                  ? "Placing order..."
                  : "Place order"}
              </span>

              {!isPending && (
                <ArrowRight size={18} />
              )}
            </button>

            <div className="shop-checkout-security">
              <ShieldCheck size={16} />

              <span>
                Secure checkout ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Cash on Delivery
              </span>
            </div>

          </div>

        </aside>

      </div>

      {/* EDIT ADDRESS MODAL */}

      <Modal
        show={Boolean(editingAddress)}
        onHide={() =>
          setEditingAddress(null)
        }
        centered
        size="lg"
      >
        <Form onSubmit={handleUpdateAddress}>

          <Modal.Header closeButton>
            <Modal.Title>
              Edit Shipping Address
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>

            {editingAddress && (
              <>
                <input
                  type="hidden"
                  name="id"
                  value={editingAddress.id}
                />

                <input
                  type="hidden"
                  name="type"
                  value="SHIPPING"
                />

                <div className="row g-3">

                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label>
                        Full name
                      </Form.Label>

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
                      <Form.Label>
                        Phone
                      </Form.Label>

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
                      <Form.Label>
                        Address
                      </Form.Label>

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
                      <Form.Label>
                        City
                      </Form.Label>

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
                      <Form.Label>
                        State / Province
                      </Form.Label>

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
                      <Form.Label>
                        Country
                      </Form.Label>

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
                      label="Make default"
                      defaultChecked={
                        editingAddress.isDefault
                      }
                    />
                  </div>

                </div>
              </>
            )}

          </Modal.Body>

          <Modal.Footer>

            <Button
              type="button"
              variant="light"
              onClick={() =>
                setEditingAddress(null)
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
                : "Save changes"}
            </Button>

          </Modal.Footer>

        </Form>
      </Modal>

      {/* REMOVE ADDRESS CONFIRMATION */}

      <Modal
        show={Boolean(removingAddressId)}
        onHide={() =>
          setRemovingAddressId(null)
        }
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Remove Address
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="mb-0">
            Are you sure you want to remove
            this address? This action cannot be undone.
          </p>
        </Modal.Body>

        <Modal.Footer>

          <Button
            type="button"
            variant="light"
            onClick={() =>
              setRemovingAddressId(null)
            }
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={handleRemoveAddress}
            disabled={isPending}
          >

            {isPending
              ? "Removing..."
              : "Remove Address"}
          </Button>

        </Modal.Footer>
      </Modal>

    </div>
  );
}