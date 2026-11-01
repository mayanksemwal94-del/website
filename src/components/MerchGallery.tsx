import type { MerchProduct } from "@/lib/content";
import type { ShopifyProduct } from "@/lib/shopify";
import AddToCart from "@/components/AddToCart";

type Props = {
  collectionName: string;
  products: ShopifyProduct[] | null;
  samples: MerchProduct[];
};

export default function MerchGallery({ collectionName, products, samples }: Props) {
  if (products && products.length === 0) {
    return <div className="empty-store">No approved products in this collection yet. Add them to Shopify when the store is ready.</div>;
  }
  const isLive = products !== null;
  const items = isLive ? products : samples;
  return (
    <div className="product-grid">
      {items.map((product) => {
        const sample = "sample" in product;
        const image = !sample ? product.imageUrl : null;
        const variantId = sample ? null : product.variantId;
        const price = !sample && product.price && product.currency
          ? new Intl.NumberFormat("en", { style: "currency", currency: product.currency }).format(Number(product.price))
          : null;
        return (
          <article className="product-card" key={product.id}>
            <div
              className={`product-art ${sample ? `art-${product.artwork}` : "art-shopify"}`}
              style={image ? { backgroundImage: `url(${JSON.stringify(image).slice(1, -1)})` } : undefined}
              role={image ? "img" : undefined}
              aria-label={image ? (!sample ? product.imageAlt : product.title) : undefined}
            >
              {sample ? <span className="product-art-word">{product.collection === "flares-of-gold" ? "FOG" : "M / S"}</span> : null}
              <span className="product-label">{sample ? "Sample design" : collectionName}</span>
            </div>
            <div className="product-info">
              <div><h3>{product.title}</h3><p>{product.description || (sample ? "Sample · final details pending" : collectionName)}</p></div>
              <span className="product-price">{price ?? (sample ? "Sample" : "Price on store")}</span>
              <AddToCart variantId={variantId} title={product.title} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
