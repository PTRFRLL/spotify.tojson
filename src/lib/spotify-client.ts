import { Session } from "next-auth";
import { Artist, Playlist, SpotifyResponse, SpotifyTrack, Track } from "@/types";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const formatTracks = (tracks: SpotifyTrack[]): Track[] => {
  return tracks.map((track) => {
    return {
      name: track.name,
      id: track.id,
      artists: track.artists.map((artist: Artist) => artist.name),
      image: track.album?.images?.[0]?.url ?? "",
      album: track.album?.name ?? "",
      uri: track.uri,
    };
  });
};

export class SpotifyClient {
  private session: Session;
  private onSessionUpdate?: (session: Session) => void;

  constructor(session: Session, onSessionUpdate?: (session: Session) => void) {
    this.session = session;
    this.onSessionUpdate = onSessionUpdate;
  }

  /**
   * Refreshes the access token using the server-side refresh endpoint
   */
  private async refreshToken(): Promise<string> {
    try {
      const response = await fetch("/api/auth/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new AuthError("Failed to refresh token");
      }

      const data = await response.json();

      // Update the session with new token data
      this.session.token.access_token = data.access_token;
      this.session.token.expires_at = data.expires_at;
      if (data.refresh_token) {
        this.session.token.refresh_token = data.refresh_token;
      }

      // Notify parent component of session update
      if (this.onSessionUpdate) {
        this.onSessionUpdate(this.session);
      }

      return data.access_token;
    } catch (error) {
      console.error("Token refresh error:", error);
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError("Failed to refresh access token");
    }
  }

  /**
   * Core fetch wrapper with automatic token refresh and error handling
   */
  async fetch<T>(url: string): Promise<T> {
    let token = this.session.token.access_token;

    // Proactive expiry check (refresh if within 60 seconds of expiry)
    const expiresIn = this.session.token.expires_at * 1000 - Date.now();
    if (expiresIn < 60000) {
      token = await this.refreshToken();
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Handle unexpected 401 (token invalid despite not expired)
    if (res.status === 401) {
      token = await this.refreshToken();
      // Retry once with new token
      const retryRes = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!retryRes.ok) {
        throw new AuthError(`Spotify API error after token refresh: ${retryRes.status}`);
      }

      return retryRes.json();
    }

    if (res.status === 429) {
      throw new Error("Rate limit exceeded. Please wait and try again later.");
    }

    if (!res.ok) {
      throw new Error(`Spotify API error: ${res.status}`);
    }

    return res.json();
  }

  /**
   * Recursive paginated fetch with progress callbacks
   */
  async fetchPaginated(
    url: string,
    onProgress?: (progress: number) => void,
    data: any[] = []
  ): Promise<any[]> {
    try {
      const response: SpotifyResponse = await this.fetch(url);
      data = data.concat(response.items);

      if (response.next) {
        const offset = response.offset || 0;
        const progress = Math.ceil((offset / response.total) * 100);
        if (onProgress) {
          onProgress(progress);
        }
        return await this.fetchPaginated(response.next, onProgress, data);
      } else {
        if (onProgress) {
          onProgress(100);
        }
        return data;
      }
    } catch (error) {
      console.error("Paginated fetch error:", error);
      throw error;
    }
  }

  /**
   * Fetch saved tracks with pagination
   */
  async fetchSavedTracks(page: number): Promise<{ tracks: Track[]; total: number }> {
    const url = new URL("https://api.spotify.com/v1/me/tracks");
    const offset = (page - 1) * 50;
    url.search = new URLSearchParams({ offset: offset.toString(), limit: "50" }).toString();

    const data = await this.fetch<any>(url.toString());
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
  }

  /**
   * Fetch all saved tracks with progress tracking
   */
  async fetchAllSavedTracks(onProgress?: (progress: number) => void): Promise<Track[]> {
    const url = "https://api.spotify.com/v1/me/tracks?limit=50";
    const data = await this.fetchPaginated(url, onProgress);

    return data.map(({ track }: { track: SpotifyTrack }) => {
      return {
        name: track.name,
        id: track.id,
        artists: track.artists.map((artist: Artist) => artist.name),
        image: track.album?.images?.[0]?.url ?? "",
        album: track.album?.name ?? "",
        uri: track.uri,
      } as Track;
    });
  }

  /**
   * Fetch top tracks by time range
   */
  async fetchTopTracks(term: string = "short_term"): Promise<{ tracks: Track[]; total: number }> {
    const url = new URL("https://api.spotify.com/v1/me/top/tracks");
    url.search = new URLSearchParams({ time_range: term, limit: "50" }).toString();

    const data = await this.fetch<SpotifyResponse>(url.toString());
    const tracks: Track[] = formatTracks(data.items);

    return { tracks, total: data.total };
  }

  /**
   * Fetch user playlists
   */
  async fetchUserPlaylists(): Promise<{ playlists: Playlist[]; total: number }> {
    const url = "https://api.spotify.com/v1/me/playlists?limit=50";
    const data = await this.fetchPaginated(url);

    const playlists: Playlist[] = data.map((playlist: any) => {
      return {
        name: playlist.name,
        id: playlist.id,
        public: playlist.public,
        description: playlist.description,
        collaborative: playlist.collaborative,
        trackCount: playlist.tracks.total,
        tracksUrl: playlist.tracks.href,
        image: playlist.images?.[0]?.url ?? "",
      };
    });

    return { playlists, total: data.length };
  }

  /**
   * Fetch tracks for a specific playlist with rate limiting
   */
  async fetchPlaylistTracks(tracksUrl: string, rateLimit: boolean = false): Promise<Track[]> {
    if (rateLimit) {
      await delay(200);
    }

    const data = await this.fetchPaginated(tracksUrl);
    return formatTracks(data.map((item: any) => item.track));
  }

  /**
   * Fetch all playlists with their tracks (for export)
   */
  async fetchAllPlaylistsWithTracks(
    onProgress?: (progress: number) => void
  ): Promise<Playlist[]> {
    const { playlists } = await this.fetchUserPlaylists();

    if (onProgress) {
      onProgress(0);
    }

    const playlistsWithTracks = [];

    for (let i = 0; i < playlists.length; i++) {
      const tracks = await this.fetchPlaylistTracks(playlists[i].tracksUrl, true);
      const playlist = { ...playlists[i] };
      playlist.tracks = tracks;
      // Remove internal fields
      delete (playlist as any).tracksUrl;
      delete (playlist as any).id;
      playlistsWithTracks.push(playlist);

      if (onProgress) {
        const progress = Math.ceil(((i + 1) / playlists.length) * 100);
        onProgress(progress);
      }
    }

    return playlistsWithTracks;
  }
}
