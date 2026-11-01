const apiVersion = process.env.SHOPIFY_API_VERSION;
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  imageUrl: string | null;
  imageAlt: string;
  variantId: string | null;
  price: string | null;
  currency: string | null;
};

type ShopifyResult<T> = { data?: T; errors?: { message: string }[] };

export function isShopifyConfigured() {
  return Boolean(apiVersion && domain && token);
}

async function storefront<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  if (!isShopifyConfigured()) throw new Error("Shopify Storefront API is not configured.");
  const response = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token as string,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });
  if (!response.ok) throw new Error(`Shopify Storefront API returned ${response.status}.`);
  const result = (await response.json()) as ShopifyResult<T>;
  if (result.errors?.length || !result.data) {
    throw new Error(result.errors?.map((error) => error.message).join("; ") || "Shopify returned no data.");
  }
  return result.data;
}

const productQuery = `query CollectionProducts($handle: String!) {
  collection(handle: $handle) {
    products(first: 12) {
      nodes {
        id handle title description
        featuredImage { url altText }
        variants(first: 1) { nodes { id price { amount currencyCode } } }
      }
    }
  }
}`;

export async function getCollectionProducts(handle: string): Promise<ShopifyProduct[] | null> {
  if (!isShopifyConfigured()) return null;
  try {
    const result = await storefront<{
      collection: null | {
        products: {
          nodes: {
            id: string;
            handle: string;
            title: string;
            description: string;
            featuredImage: null | { url: string; altText: string | null };
            variants: { nodes: { id: string; price: { amount: string; currencyCode: string } }[] };
          }[];
        };
      };
    }>(productQuery, { handle });
    if (!result.collection) return [];
    return result.collection.products.nodes.map((product) => {
      const variant = product.variants.nodes[0];
      return {
        id: product.id,
        handle: product.handle,
        title: product.title,
        description: product.description,
        imageUrl: product.featuredImage?.url ?? null,
        imageAlt: product.featuredImage?.altText ?? product.title,
        variantId: variant?.id ?? null,
        price: variant?.price.amount ?? null,
        currency: variant?.price.currencyCode ?? null,
      };
    });
  } catch (error) {
    console.error("Unable to load Shopify collection", error);
    return [];
  }
}

export async function createOrUpdateCart(input: {
  cartId?: string;
  variantId: string;
  quantity: number;
}) {
  const mutation = input.cartId
    ? `mutation AddLines($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart { id checkoutUrl totalQuantity }
          userErrors { field message }
        }
      }`
    : `mutation CreateCart($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart { id checkoutUrl totalQuantity }
          userErrors { field message }
        }
      }`;
  const variables = {
    ...(input.cartId ? { cartId: input.cartId } : {}),
    lines: [{ merchandiseId: input.variantId, quantity: input.quantity }],
  };
  const result = await storefront<{
    cartLinesAdd?: { cart: { id: string; checkoutUrl: string; totalQuantity: number } | null; userErrors: { message: string }[] };
    cartCreate?: { cart: { id: string; checkoutUrl: string; totalQuantity: number } | null; userErrors: { message: string }[] };
  }>(mutation, variables);
  const payload = result.cartLinesAdd ?? result.cartCreate;
  if (!payload || payload.userErrors.length || !payload.cart) {
    throw new Error(payload?.userErrors.map((item) => item.message).join("; ") || "Unable to create Shopify cart.");
  }
  return payload.cart;
}
