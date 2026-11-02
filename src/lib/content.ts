export type ReleaseStatus = "released" | "upcoming";

export type Song = {
  title: string;
  status: ReleaseStatus;
  href?: string;
  appleMusicHref?: string;
  youtubeMusicHref?: string;
  amazonMusicSearchHref?: string;
  collaborator?: string;
  cover?: string;
  releaseDate?: string;
  linkLabel?: "Listen" | "Watch";
};

export type MerchProduct = {
  id: string;
  title: string;
  collection: "mayank-semwal" | "flares-of-gold";
  description: string;
  artwork: "tee" | "disc" | "tote";
  sample: true;
};

const spotifyArtist = "https://open.spotify.com/artist/1ZMGNNZuSreteDhGEaoCpU";

export const currentSongs: Song[] = [
  {
    title: "Safar",
    status: "released",
    href: "https://open.spotify.com/track/0SYcAUDwKMcdwW84QNYavw",
  },
  { title: "Puff Puff Pass", status: "released", href: spotifyArtist },
  {
    title: "Woh Tu Hi Hai",
    status: "released",
    href: "https://open.spotify.com/track/3JEa9UkBG0kvpiInMifU5c",
    collaborator: "Harshit Ahluwalia",
  },
  {
    title: "Bhula Do Mujhe",
    status: "released",
    href: "https://open.spotify.com/track/4y1fI2xAYzW4b10fXrnB4h",
    appleMusicHref: "https://music.apple.com/in/album/bhula-do-mujhe/6804393568?i=6804393571&uo=4",
    youtubeMusicHref: "https://music.youtube.com/watch?v=HbvGCMHBhB4",
    amazonMusicSearchHref: "https://music.amazon.in/search/Bhula%20Do%20Mujhe%20Mayank%20Semwal",
    cover: "/images/bhula-do-mujhe-cover.webp",
  },
  {
    title: "Keh Do",
    status: "released",
    href: "https://open.spotify.com/track/1UeFEEShnjmhdJS0QblkwF",
    appleMusicHref: "https://music.apple.com/in/album/keh-do/6822160515?i=6822160517&uo=4",
    youtubeMusicHref: "https://music.youtube.com/watch?v=xfvfWg-ahiw",
    amazonMusicSearchHref: "https://music.amazon.in/search/Keh%20Do%20Mayank%20Semwal",
    cover: "/images/keh-do-single-cover.webp",
    linkLabel: "Listen",
  },
];

export const upcomingSongs: Song[] = [
  { title: "Mera Ghar", status: "upcoming", cover: "/images/mera-ghar-cover.webp", releaseDate: "27 November" },
  { title: "Pal Roshni Ka", status: "upcoming", cover: "/images/pal-roshni-ka-cover.webp" },
  { title: "Mera Kasoor", status: "upcoming", cover: "/images/mera-kasoor-cover.webp" },
  { title: "Woh Hai Kahan", status: "upcoming", cover: "/images/woh-hai-kahan-cover.webp" },
];

export const dhaageTracks: Song[] = [
  currentSongs[3],
  currentSongs[4],
  ...upcomingSongs,
];

export const releaseSchedule = {
  cadence: "Last Friday of each month",
  epTitle: "Dhaage",
  epReleaseMonth: "February",
  epReleaseYear: null,
} as const;

export const flaresAlbum = {
  artist: "Flares Of Gold",
  shortName: "FOG",
  title: "Life in a Walnut",
  releaseMonth: "February",
  releaseYear: null,
  spotifyHref: "https://open.spotify.com/album/00S6Moo4UgEMAPZVbheifv",
  albumCover: "/images/fog-life-in-a-walnut-cover.webp",
  trackCount: 12,
  totalDuration: "55:43",
} as const;

export const flaresTracks = [
  { title: "Life in a Walnut", duration: "3:53", href: "https://open.spotify.com/track/54DmSCqH5l86sTjoumHuwS" },
  { title: "Online Bin", duration: "4:52", href: "https://open.spotify.com/track/59feIiByN2ucHwI0wU7l3f" },
  { title: "Money", duration: "3:47", href: "https://open.spotify.com/track/26dYzBp9PBo7suYARnNUPD" },
  { title: "Planet Funkatopia", duration: "5:39", href: "https://open.spotify.com/track/0kF5ebwbm1154R2NbCGXMx" },
  { title: "Life Goes On", duration: "4:05", href: "https://open.spotify.com/track/40mWsN0BT9QOTPVdzPEe5C" },
  { title: "Put Your Hands Up", duration: "4:58", href: "https://open.spotify.com/track/7lO9Be6fLORXiXBCpuU7yD" },
  { title: "Suck it and See", duration: "5:15", href: "https://open.spotify.com/track/5o9DR1Rq89sJZDndpWsO83" },
  { title: "Funky Monkeys", duration: "4:46", href: "https://open.spotify.com/track/6Vj3d4QbtFVVnHyREGqVfW" },
  { title: "FOG Anthem", duration: "4:44", href: "https://open.spotify.com/track/6UKdPRFaRlIB8iZLWohwdy" },
  { title: "Hey Girls", duration: "5:32", href: "https://open.spotify.com/track/5SrQGVcd1jgNgVNM1jVMwR" },
  { title: "Collateral Damage", duration: "3:17", href: "https://open.spotify.com/track/5GpxrIYGIXbDqQoDDoaraI" },
  { title: "People Gathered in the Crowd", duration: "4:50", href: "https://open.spotify.com/track/7d48OdiKFNJKDK9D4VdPWZ" },
] as const;

export const flaresVideos = [
  { title: "Life in a Walnut", videoId: "SPnhqlPwpoc", href: "https://www.youtube.com/watch?v=SPnhqlPwpoc" },
  { title: "Planet Funkatopia", videoId: "5Za7_iboR28", href: "https://www.youtube.com/watch?v=5Za7_iboR28" },
  { title: "People Gathered in the Crowd", videoId: "fLZoB9_PPaQ", href: "https://www.youtube.com/watch?v=fLZoB9_PPaQ" },
  { title: "Online Bin", videoId: "5QeUkW6Coao", href: "https://www.youtube.com/watch?v=5QeUkW6Coao" },
  { title: "Money", videoId: "rmDuS_ky_po", href: "https://www.youtube.com/watch?v=rmDuS_ky_po" },
  { title: "Funky Monkeys", videoId: "L3Ap_EN0nfE", href: "https://www.youtube.com/watch?v=L3Ap_EN0nfE" },
] as const;

export const mayankVideos = [
  {
    status: "latest",
    title: "Mayank Semwal – Keh Do (कह दो) | Official Music Video | Hindi Romantic Song 2026",
    shortTitle: "Keh Do (कह दो)",
    videoId: "xfvfWg-ahiw",
    href: "https://www.youtube.com/watch?v=xfvfWg-ahiw",
  },
  {
    status: "previous",
    title: "Bhula Do Mujhe भुला दो मुझे | Official Music Video | Mayank Semwal",
    shortTitle: "Bhula Do Mujhe",
    videoId: "HbvGCMHBhB4",
    href: "https://www.youtube.com/watch?v=HbvGCMHBhB4",
    cover: "/images/bhula-do-mujhe-cover.webp",
  },
] as const;

export const flaresSocialLinks = [
  { label: "Spotify", href: "https://open.spotify.com/artist/3wzaUfjpLhYUlUkqx7DzFC" },
  { label: "YouTube archive", href: "https://www.youtube.com/channel/UCrBajS-tVTl3y6pLEw4S9Nw" },
  { label: "Facebook", href: "https://www.facebook.com/Flaresofgold/" },
  { label: "Instagram", href: "https://www.instagram.com/flaresofgold/" },
] as const;

export const mayankMerch: MerchProduct[] = [
  {
    id: "mayank-tee-sample",
    title: "In-between tour tee",
    collection: "mayank-semwal",
    description: "Sample concept · final details pending",
    artwork: "tee",
    sample: true,
  },
  {
    id: "dhaage-cd-sample",
    title: "Dhaage collector CD",
    collection: "mayank-semwal",
    description: "Sample concept · final details pending",
    artwork: "disc",
    sample: true,
  },
  {
    id: "mayank-tote-sample",
    title: "Long way home tote",
    collection: "mayank-semwal",
    description: "Sample concept · final details pending",
    artwork: "tote",
    sample: true,
  },
];

export const flaresMerch: MerchProduct[] = [
  {
    id: "fog-tee-sample",
    title: "FOG classic tee",
    collection: "flares-of-gold",
    description: "Sample concept · final details pending",
    artwork: "tee",
    sample: true,
  },
  {
    id: "fog-album-cd-sample",
    title: "Life in a Walnut · CD",
    collection: "flares-of-gold",
    description: "Sample concept · final details pending",
    artwork: "disc",
    sample: true,
  },
  {
    id: "fog-tote-sample",
    title: "FOG canvas tote",
    collection: "flares-of-gold",
    description: "Sample concept · final details pending",
    artwork: "tote",
    sample: true,
  },
];

export const aiPerspective = {
  title: "AI is a tool, like a knife.",
  body: [
    "People can use a knife to kill each other, or to prepare food and feed each other. The tool doesn't choose its purpose; people do.",
    "I have a background in Computer Engineering, and I've always enjoyed exploring new technologies and figuring out how they work. AI feels like a revolution to me. I'm still learning where it helps, where it falls short, and what I want my work with it to look like.",
    "For my music videos, I use AI as a filmmaking tool. I usually start with an image or a moment I can picture, then explore which tools and features might help me bring it closer to the screen. Understanding the tools matters to me.",
    "It lets me guide the process, decide what to keep or change, and shape how the shots fit the song. I feel a lot of creative control, but the result still takes work.",
    "When I have a specific idea in mind, it takes effort and many attempts to get close to it. I try different approaches, adjust shots, and discard what isn't working. AI doesn't finish the video in one prompt; I keep working with the results until they serve the idea.",
    "Every artist will have their own relationship with AI, and some may choose not to use it. I don't have a formula for anyone else. If you're curious about it, start with an idea you care about and take time to learn the tools. I'm still learning too.",
  ],
} as const;

export const socialLinks = {
  spotify: spotifyArtist,
  youtube: "https://www.youtube.com/@mayank.semwal",
  instagram: "https://www.instagram.com/mayank.semwal/",
} as const;
