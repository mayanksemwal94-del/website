import Link from "next/link";
import Carousel from "@/components/Carousel";
import AIFilmSection from "@/components/AIFilmSection";
import DhaageMusicGate from "@/components/DhaageMusicGate";
import MerchGallery from "@/components/MerchGallery";
import MusicVideos from "@/components/MusicVideos";
import PublicMusicTeaser from "@/components/PublicMusicTeaser";
import SiteHeader from "@/components/SiteHeader";
import { mayankMerch, socialLinks } from "@/lib/content";
import { getCollectionProducts } from "@/lib/shopify";

export default async function Home() {
  const collection = process.env.SHOPIFY_MAYANK_COLLECTION_HANDLE || "mayank-semwal";
  const products = await getCollectionProducts(collection);
  return (
    <>
      <SiteHeader />
      <main>
        <Carousel />
        <div className="ticker" aria-hidden="true"><span>✳ MAYANK SEMWAL · DHAAGE · NEW MUSIC EVERY LAST FRIDAY · SONGS FOR THE IN-BETWEEN · MAYANK SEMWAL · DHAAGE · NEW MUSIC EVERY LAST FRIDAY · </span></div>

        <PublicMusicTeaser />

        <section className="section" id="dhaage"><div className="page-wrap">
          <div className="section-head"><div><span className="eyebrow">02 / An EP in six threads</span><h2>Dhaage.</h2></div><p>EP planned for February<br />Year and exact date to confirm</p></div>
          <DhaageMusicGate />
        </div></section>

        <MusicVideos />

        <AIFilmSection />

        <section className="section shop-section" id="shop"><div className="page-wrap"><div className="section-head"><div><span className="eyebrow">05 / Wear the feeling</span><h2>Mayank’s merch.</h2></div><p>Sample designs now.<br />Approved store listings when ready.</p></div><MerchGallery collectionName="Mayank Semwal" products={products} samples={mayankMerch} /></div></section>

        <section className="section collab-section"><div className="page-wrap"><div className="section-head"><div><span className="eyebrow">06 / Shared frequencies</span><h2>Good music travels.</h2></div><p>Other artists<br />& collaborator EPs</p></div><div className="collab-layout"><p>A place for EPs and releases from the artists who work with Mayank. Each project can have its own artwork and listening link as it’s approved.</p><div className="collab-list"><div><strong>Collaborator EP</strong><span>Project details to be added</span></div><div><strong>Another artist’s release</strong><span>Artwork & link to come</span></div></div></div></div></section>

        <section className="locked-events"><div><span className="eyebrow">07 / In person</span><h2>Live dates & events</h2></div><button type="button" disabled aria-disabled="true">Locked for now · unavailable</button></section>

        <section className="project-callout"><div><span className="eyebrow">A project by Mayank</span><h2>Flares Of Gold <em>/ FOG</em></h2><p>Debut album Life in a Walnut · 12 tracks on Spotify.</p></div><Link className="button button-outline-light" href="/flares-of-gold">Enter the FOG page ↗</Link></section>
      </main>
      <footer className="site-footer"><span>© Mayank Semwal</span><div><a href={socialLinks.instagram} target="_blank" rel="noreferrer">Instagram ↗</a><a href={socialLinks.youtube} target="_blank" rel="noreferrer">YouTube ↗</a><a href={socialLinks.spotify} target="_blank" rel="noreferrer">Spotify ↗</a><Link href="/flares-of-gold">Flares Of Gold ↗</Link></div></footer>
    </>
  );
}
