"use client";

import { useTransition } from "react";
import { Form, Button, Table } from "react-bootstrap";
import { addProductVariantAction } from "../../actions";

interface Variant { id: string; name: string; value: string; sku: string; stock: number; priceDelta: unknown }

export function ProductVariantManager({ productId, variants }: { productId: string; variants: Variant[] }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await addProductVariantAction(productId, formData);
      e.currentTarget.reset();
    });
  }

  return (
    <div>
      {variants.length > 0 && (
        <Table size="sm" className="mb-3">
          <thead><tr><th>Name</th><th>Value</th><th>Stock</th></tr></thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v.id}><td>{v.name}</td><td>{v.value}</td><td>{v.stock}</td></tr>
            ))}
          </tbody>
        </Table>
      )}
      <Form onSubmit={handleSubmit}>
        <div className="d-flex gap-2 mb-2">
          <Form.Control size="sm" name="name" placeholder="Name (e.g. Size)" required />
          <Form.Control size="sm" name="value" placeholder="Value (e.g. XL)" required />
        </div>
        <div className="d-flex gap-2 mb-2">
          <Form.Control size="sm" name="sku" placeholder="Variant SKU" required />
          <Form.Control size="sm" type="number" name="stock" placeholder="Stock" required />
        </div>
        <Button size="sm" variant="outline-primary" type="submit" disabled={isPending}>Add variant</Button>
      </Form>
    </div>
  );
}
