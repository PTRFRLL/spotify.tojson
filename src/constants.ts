import paths from "./paths";

export const SITE_NAME = "Spotify.toJSON()";

const REPO_PATH = "https://github.com/PTRFRLL/spotify.tojson";

export type NavItem = {
  name: string;
  href: string;
  isProtected: boolean;
};
export const NAV_ITEMS: NavItem[] = [
  {
    name: "Top Tracks",
    href: paths.top,
    isProtected: true,
  },
  {
    name: "Saved Tracks",
    href: paths.saved,
    isProtected: true,
  },
  {
    name: "Playlists",
    href: paths.playlists,
    isProtected: true,
  },
  {
    name: "About",
    href: REPO_PATH,
    isProtected: false,
  },
];
