import { EventEmitter } from "events";
import { fetchFromSpotify, fetchPaginatedFromSpotify, fetchUserPlaylists } from "./spotify";
import { Artist, SpotifyResponse, SpotifyTrack, Track } from "@/types";
const SAVED_TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/tracks?limit=50";
const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const formatTracks = (tracks: SpotifyTrack[]) => {
  return tracks.map((track) => {
    return {
      name: track.name,
      artists: track.artists.map((artist: Artist) => artist.name),
      image: track.album.images?.[0]?.url ?? "",
      album: track.album.name,
      uri: track.uri,
    };
  });
};
export class SpotifyTask extends EventEmitter {
  constructor() {
    super();
  }

  async fetchPlaylists() {
    const { playlists } = await fetchUserPlaylists();
    this.emit("start", { total: playlists.length });
    const playlistsWithTracks = [];
    for (let playlist of playlists) {
      const tracks = await fetchPaginatedFromSpotify(playlist.tracksUrl);
      playlist.tracks = formatTracks(tracks.map((t) => t.track));
      //@ts-ignore
      delete playlist.tracksUrl;
      //@ts-ignore
      delete playlist.id;
      playlistsWithTracks.push(playlist);
      let progress = Math.ceil((playlistsWithTracks.length / playlists.length) * 100);
      this.emit("progress", { progress });

      // Delay the next request to avoid hitting the API rate limit
      await delay(200);
    }
    this.emit("end", { data: playlistsWithTracks });
  }

  async fetchPaginated(url: string, data = []): Promise<any[]> {
    try {
      const response: SpotifyResponse = await fetchFromSpotify(url);
      //@ts-expect-error
      data = data.concat(response.items);

      if (response.next) {
        let offset = response.offset || 1;
        let progress = Math.ceil((offset / response.total) * 100);
        this.emit("progress", { progress });
        return await this.fetchPaginated(response.next, data);
      } else {
        return data;
      }
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async fetchSavedTracks() {
    this.emit("start", { total: 100 });
    const data = await this.fetchPaginated(SAVED_TRACKS_ENDPOINT);
    const tracks: Track[] = data.map(({ track }) => {
      return {
        name: track.name,
        artists: track.artists.map((artist: Artist) => artist.name),
        image: track.album.images?.[0]?.url,
        album: track.album.name,
        uri: track.uri,
      };
    });
    this.emit("end", { data: tracks });
  }
}
