"use client";

import { useState, useTransition } from "react";
import { Button, Modal } from "react-bootstrap";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { deleteProductAction } from "./actions";

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const [show, setShow] = useState(false);
  const [isPending, startTransition] = useTransition();

  function confirmDelete() {
    startTransition(async () => {
      try {
        await deleteProductAction(productId);
        toast.success("Product deleted");
        setShow(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not delete product.");
      }
    });
  }

  return (
    <>
      <Button variant="link" className="text-danger p-0" onClick={() => setShow(true)} aria-label="Delete product">
        <Trash2 size={16} />
      </Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title className="h6">Delete product?</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete <strong>{productName}</strong>? This cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShow(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={isPending}>{isPending ? "Deleting..." : "Delete"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
