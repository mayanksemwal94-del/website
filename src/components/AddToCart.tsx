"use client";

import { useState } from "react";

type AddToCartProps = { variantId: string | null; title: string };
type CartState = { id: string; checkoutUrl: string; totalQuantity: number };
const STORAGE_KEY = "mayank-store-cart";

export default function AddToCart({ variantId, title }: AddToCartProps) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function add() {
    if (!variantId) return;
    setBusy(true);
    setMessage("");
    try {
      const previous = window.localStorage.getItem(STORAGE_KEY);
      const existing = previous ? (JSON.parse(previous) as CartState) : null;
      const response = await fetch("/api/shopify/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId: existing?.id, variantId, quantity: 1 }),
      });
      const result = await response.json() as CartState | { error?: string };
      if (!response.ok || !("id" in result) || !("checkoutUrl" in result)) {
        throw new Error("error" in result ? result.error : "Unable to update the cart.");
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
      window.dispatchEvent(new Event("mayank-cart-updated"));
      setMessage(`${title} added. `);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update the cart.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="product-action">
      <button className="add-to-cart" type="button" onClick={add} disabled={!variantId || busy}>
        {busy ? "Adding…" : variantId ? "Add to bag ↗" : "Sample · not for sale yet"}
      </button>
      {message && <p className="product-message" role="status">{message}</p>}
    </div>
  );
}
