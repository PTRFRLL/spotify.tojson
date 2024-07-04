"use server";
const TOP_TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks";
const SAVED_TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/tracks?limit=50";
const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists?limit=50";
import { auth, signOut } from "@/auth";
import { Artist, Playlist, SpotifyResponse, SpotifyTrack, Track } from "@/types";

export const fetchFromSpotify = async <T>(url: string): Promise<T> => {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthenticated");
  }

  const headers = {
    Authorization: `Bearer ${session.token.access_token}`,
  };

  const res = await fetch(url, {
    headers,
  });
  if (!res.ok) {
    if (res.status === 429) {
      // this.addToOutput(`❌ Rate limit exceeded. Please wait and try again later.`);
    } else if (res.status === 401) {
      signOut({ redirectTo: "/" });
    }
  }
  return res.json();
};

export const fetchPaginatedFromSpotify = async (url: string, data: any[] = []): Promise<any[]> => {
  try {
    const response: SpotifyResponse = await fetchFromSpotify(url);
    data = data.concat(response.items);

    if (response.next) {
      return await fetchPaginatedFromSpotify(response.next, data);
    } else {
      return data;
    }
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const fetchSavedTracks = async (page: number): Promise<{ tracks: Track[]; total: number }> => {
  const url = new URL(SAVED_TRACKS_ENDPOINT);
  const offset = (page - 1) * 50;
  url.search = new URLSearchParams({ offset: offset.toString(), limit: "50" }).toString();
  const test = url.toString();
  const data = await fetchFromSpotify<any>(test);
  const tracks = data.items.map(({ track }: { track: SpotifyTrack }) => {
    return {
      name: track.name,
      id: track.id,
      artists: track.artists.map((artist: Artist) => artist.name),
      image: track.album?.images?.[0]?.url ?? "",
      album: track.album?.name ?? "",
      uri: track.uri,
    } as Track;
  });

  return { tracks, total: data.total };
};

const formatTracks = (tracks: SpotifyTrack[]) => {
  return tracks.map((track) => {
    return {
      name: track.name,
      id: track.id,
      artists: track.artists.map((artist: Artist) => artist.name),
      image: track.album.images?.[0]?.url ?? "",
      album: track.album.name,
      uri: track.uri,
    };
  });
};

export const fetchTopTracks = async (term: string = "short_term"): Promise<{ tracks: Track[]; total: number }> => {
  const url = new URL(TOP_TRACKS_ENDPOINT);

  url.search = new URLSearchParams({ time_range: term, limit: "50" }).toString();
  const get = url.toString();

  const data = await fetchFromSpotify<SpotifyResponse>(get);

  const tracks: Track[] = formatTracks(data.items);

  return { tracks, total: data.total };
};

export const fetchUserPlaylists = async (): Promise<{ playlists: Playlist[]; total: number }> => {
  const url = new URL(PLAYLISTS_ENDPOINT);
  url.search = new URLSearchParams({ limit: "50" }).toString();
  const data = await fetchPaginatedFromSpotify(url.toString());

  const playlists: Playlist[] = data.map((playlist: any) => {
    return {
      name: playlist.name,
      id: playlist.id,
      public: playlist.public,
      description: playlist.description,
      collaborative: playlist.collaborative,
      trackCount: playlist.tracks.total,
      tracksUrl: playlist.tracks.href,
      image: playlist.images?.[0].url ?? "",
    };
  });

  return { playlists, total: data.length };
};
