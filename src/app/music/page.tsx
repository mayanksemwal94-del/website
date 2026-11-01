import type { Metadata } from "next";
import MusicLibrary from "../../components/MusicLibrary";
import SiteHeader from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "Music | Mayank Semwal",
  description: "Listen to Mayank Semwal’s released music and early previews for members.",
};

export default function MusicPage() {
  return (
    <>
      <SiteHeader />
      <MusicLibrary />
    </>
  );
}
