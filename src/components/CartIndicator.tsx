"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type StoreCart = { id: string; checkoutUrl: string; totalQuantity: number };
const STORAGE_KEY = "mayank-store-cart";

export default function CartIndicator() {
  const [cart, setCart] = useState<StoreCart | null>(null);
  useEffect(() => {
    const update = () => {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) { setCart(null); return; }
      try { setCart(JSON.parse(raw) as StoreCart); } catch { setCart(null); }
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener("mayank-cart-updated", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("mayank-cart-updated", update);
    };
  }, []);
  if (cart?.checkoutUrl) {
    return <a className="cart-link" href={cart.checkoutUrl} target="_blank" rel="noopener noreferrer">Bag · {cart.totalQuantity} ↗</a>;
  }
  return <Link className="cart-link" href="/#shop">Shop ↘</Link>;
}
