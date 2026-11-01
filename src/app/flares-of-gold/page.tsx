import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MerchGallery from "@/components/MerchGallery";
import SiteHeader from "@/components/SiteHeader";
import { flaresAlbum, flaresMerch, flaresSocialLinks, flaresTracks, flaresVideos } from "@/lib/content";
import { getCollectionProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Flares Of Gold / FOG — Mayank Semwal",
  description: "Flares Of Gold (FOG), a funk band from North India. Listen to Life in a Walnut, explore the tracks, and watch videos from the band's earlier YouTube channel.",
};

const bandPhotos: Array<{ src: string; alt: string; caption: string; wide?: boolean }> = [
  { src: "/images/fog-band-stage.webp", alt: "Flares Of Gold performing together on stage", caption: "Together on stage", wide: true },
  { src: "/images/fog-duo-live.webp", alt: "Flares Of Gold guitarist and vocalist performing together", caption: "In the song" },
  { src: "/images/fog-vocalist.webp", alt: "Flares Of Gold vocalist performing into a microphone", caption: "At the mic" },
];

export default async function FlaresOfGoldPage() {
  const collection = process.env.SHOPIFY_FOG_COLLECTION_HANDLE || "flares-of-gold";
  const products = await getCollectionProducts(collection);

  return (
    <>
      <SiteHeader project="fog" />
      <main className="fog-page">
        <section className="fog-hero">
          <div className="fog-hero-backdrop" aria-hidden="true">
            <Image src="/images/fog-crowd-performance.webp" alt="" fill priority sizes="100vw" />
          </div>
          <div className="fog-hero-copy">
            <div className="fog-brand-lockup"><Image src="/images/fog-mark.webp" alt="FOG mark" width={42} height={42} /><span className="eyebrow">A funk band from North India · FOG</span></div>
            <h1>Flares<br />Of <em>Gold.</em></h1>
            <p>We are Flares Of Gold. Most people call us FOG. This page brings together our debut album, its songs, videos from our earlier channel, and the places to find us.</p>
            <div className="fog-hero-actions">
              <a className="button button-gold" href={flaresAlbum.spotifyHref} target="_blank" rel="noreferrer">Listen to the album ↗</a>
              <a className="fog-text-link" href="#videos">Watch the videos ↓</a>
            </div>
            <div className="fog-hero-meta"><span>12 tracks</span><span>55 min 43 sec</span><span>Noida · India</span></div>
          </div>
          <div className="fog-hero-art">
            <div className="fog-live-frame">
              <Image src="/images/fog-performance-guitar.webp" alt="Flares Of Gold musicians playing guitar and bass on stage" fill sizes="(max-width: 620px) 90vw, 40vw" />
              <span>Flares Of Gold · live</span>
            </div>
            <a className="fog-cover-card" href={flaresAlbum.spotifyHref} target="_blank" rel="noreferrer" aria-label="Open Life in a Walnut on Spotify">
              <Image src={flaresAlbum.albumCover} alt="Life in a Walnut album cover by Flares Of Gold" fill sizes="(max-width: 620px) 42vw, 18vw" />
              <span>Debut album · stream now ↗</span>
            </a>
          </div>
        </section>

        <section className="section fog-section" id="album">
          <div className="page-wrap">
            <div className="section-head section-head-dark">
              <div><span className="eyebrow">01 / The debut album</span><h2>Life in a Walnut.</h2></div>
              <p>{flaresAlbum.trackCount} songs<br />{flaresAlbum.totalDuration}</p>
            </div>
            <div className="fog-album-layout">
              <div className="fog-album-art">
                <Image src={flaresAlbum.albumCover} alt="Life in a Walnut album artwork" fill sizes="(max-width: 620px) 80vw, 33vw" />
                <span className="album-art-stamp">Flares Of Gold · FOG</span>
              </div>
              <div className="fog-album-copy">
                <p><strong>Life in a Walnut</strong> is the debut album by Flares Of Gold. Its 12 tracks move through a wide range of sounds, from soulful ballads to rock and metal.</p>
                <a className="button button-gold" href={flaresAlbum.spotifyHref} target="_blank" rel="noreferrer">Open album on Spotify ↗</a>
                <ol className="fog-tracklist" aria-label="Life in a Walnut tracklist">
                  {flaresTracks.map((track, index) => (
                    <li key={track.title}>
                      <span className="fog-track-number">{String(index + 1).padStart(2, "0")}</span>
                      <a href={track.href} target="_blank" rel="noreferrer">{track.title}<span aria-hidden="true"> ↗</span></a>
                      <span className="fog-track-duration">{track.duration}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="fog-gallery-section" aria-labelledby="fog-gallery-title">
          <div className="page-wrap">
            <div className="fog-gallery-heading"><div><span className="eyebrow">02 / From the FOG photo archive</span><h2 id="fog-gallery-title">The band, in the moment.</h2></div><a href="https://www.facebook.com/Flaresofgold/photos/" target="_blank" rel="noreferrer">More photos on Facebook ↗</a></div>
            <div className="fog-photo-grid">
              {bandPhotos.map((photo) => (
                <figure className={photo.wide ? "fog-photo-wide" : undefined} key={photo.src}>
                  <div className="fog-photo-frame"><Image src={photo.src} alt={photo.alt} fill sizes={photo.wide ? "(max-width: 620px) 90vw, 75vw" : "(max-width: 620px) 90vw, 45vw"} /></div>
                  <figcaption>{photo.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="section fog-video-section" id="videos">
          <div className="page-wrap">
            <div className="section-head section-head-dark">
              <div><span className="eyebrow">03 / Watch</span><h2>FOG on film.</h2></div>
              <p>Official videos<br />Earlier YouTube channel</p>
            </div>
            <p className="fog-video-note">These videos are from FOG’s earlier YouTube channel. The new channel link can be added here when it is ready.</p>
            <div className="fog-video-grid">
              {flaresVideos.map((video) => (
                <a className="fog-video-card" href={video.href} target="_blank" rel="noreferrer" key={video.videoId}>
                  <div className="fog-video-thumbnail">
                    <Image src={`/images/fog-video-${video.videoId}.webp`} alt={`${video.title} official music video thumbnail`} fill sizes="(max-width: 620px) 90vw, 30vw" />
                    <span className="video-play" aria-hidden="true">▶</span>
                  </div>
                  <div className="fog-video-caption"><h3>{video.title}</h3><span>Watch on YouTube ↗</span></div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section fog-epk" id="epk">
          <div className="page-wrap">
            <div className="section-head">
              <div><span className="eyebrow">04 / About & contact</span><h2>Flares Of Gold.</h2></div>
              <p>Funk band<br />North India</p>
            </div>
            <div className="fog-epk-layout">
              <div><h3>From North India,<br />with a groove.</h3><p>Flares Of Gold is a funk band from North India, based in Noida, Uttar Pradesh. For press, bookings, and collaborations, reach out directly.</p><a className="button button-gold" href="mailto:flaresofgoldfog@gmail.com">Email FOG ↗</a></div>
              <div className="epk-list">
                <div><strong>Project</strong><span>Flares Of Gold · FOG</span></div>
                <div><strong>Debut album</strong><span>Life in a Walnut · 12 tracks</span></div>
                <div><strong>Based in</strong><span>Noida · Uttar Pradesh · India</span></div>
                <div><strong>Press / booking</strong><a href="mailto:flaresofgoldfog@gmail.com">flaresofgoldfog@gmail.com ↗</a></div>
                <div><strong>New YouTube channel</strong><span>Link coming soon</span></div>
                <div className="fog-social-links">{flaresSocialLinks.map((social) => <a href={social.href} key={social.label} target="_blank" rel="noreferrer">{social.label} ↗</a>)}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section fog-shop" id="shop">
          <div className="page-wrap">
            <div className="section-head section-head-dark"><div><span className="eyebrow">05 / FOG-only collection</span><h2>Flares Of Gold merch.</h2></div><p>Separate listing.<br />Shared store checkout.</p></div>
            <MerchGallery collectionName="Flares Of Gold / FOG" products={products} samples={flaresMerch} />
          </div>
        </section>

        <section className="fog-return"><span className="eyebrow">Flares Of Gold · FOG</span><h2>More from the project, as it unfolds.</h2><p>Part of Mayank Semwal’s official music home.</p><Link className="button button-gold" href="/">Back to Mayank Semwal ↗</Link></section>
      </main>
      <footer className="site-footer footer-dark"><span>Flares Of Gold · FOG</span><div className="fog-footer-links">{flaresSocialLinks.map((social) => <a href={social.href} key={social.label} target="_blank" rel="noreferrer">{social.label}</a>)}</div><Link href="/">Mayank Semwal ↗</Link></footer>
    </>
  );
}
