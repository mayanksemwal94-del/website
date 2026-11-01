import { NextResponse } from "next/server";
import { createOrUpdateCart, isShopifyConfigured } from "@/lib/shopify";

export async function POST(request: Request) {
  if (!isShopifyConfigured()) {
    return NextResponse.json({ error: "Store checkout is not configured yet." }, { status: 503 });
  }
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid cart request." }, { status: 400 });
    }
    const { cartId, variantId, quantity } = body as Record<string, unknown>;
    if (typeof variantId !== "string" || !variantId.startsWith("gid://shopify/ProductVariant/")) {
      return NextResponse.json({ error: "A valid Shopify product variant is required." }, { status: 400 });
    }
    const safeQuantity = typeof quantity === "number" && Number.isInteger(quantity)
      ? Math.min(Math.max(quantity, 1), 10)
      : 1;
    const cart = await createOrUpdateCart({
      ...(typeof cartId === "string" && cartId.startsWith("gid://shopify/Cart/") ? { cartId } : {}),
      variantId,
      quantity: safeQuantity,
    });
    return NextResponse.json(cart, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Could not add this item. Please try again." }, { status: 502 });
  }
}
