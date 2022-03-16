const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const TOP_TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks";
const SAVED_TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/tracks?limit=50";
const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists?limit=50";


import { RateLimiter } from "limiter";
const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 250 });

const getAccessToken = async (refresh_token) => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  return response.json();
};

export const getUsersTracks = async (refresh_token, time_range = "medium_term", limit = "10") => {
  const { access_token } = await getAccessToken(refresh_token);
  const URL = `${TOP_TRACKS_ENDPOINT}?time_range=${time_range}&limit=${limit}`;
  return fetch(URL, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

const fetchFromSpotify = async (access_token, url, rateLimit = false) => {
  if(rateLimit){
    const remainingMessages = await limiter.removeTokens(1);
  }
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  if (!response.ok) {
    console.error({status: response.status, response});
    return null;
  }
  return response.json();
};

export const getPlaylistTracks = async (access_token, url) => {
  const items = [];
  let response = await fetchFromSpotify(access_token, url, true);
  if (!response.items) {
    return [];
  }
  items.push(...response.items);

  while (response.next) {
    response = await fetchFromSpotify(access_token, response.next, true);
    if (!response.items) {
      return [];
    }
    items.push(...response.items);
  }
  const tracks = items.map((item) => {
    const { track } = item;
    return {
      artist: track.artists.map((_artist) => _artist.name).join(", "),
      id: track.id,
      title: track.name,
      album: track.album.name,
    };
  });
  return tracks;
};

export const getUserPlaylists = async (refresh_token) => {
  const { access_token } = await getAccessToken(refresh_token);
  let response = await fetchFromSpotify(access_token, PLAYLISTS_ENDPOINT);
  const items = [];
  items.push(...response.items);
  while (response.next) {
    response = await fetchFromSpotify(access_token, response.next);
    items.push(...response.items);
  }
  const playlists = items.map((item) => {
    return {
      title: item.name,
      public: item.public,
      tracksUrl: item.tracks.href,
      tracks: item.tracks.total,
    };
  });

  const done = Promise.all(
    playlists.map(async (playlist) => {
      const tracks = await getPlaylistTracks(access_token, playlist.tracksUrl);
      delete playlist.tracksUrl;
      return {
        ...playlist,
        tracks: tracks,
      };
    })
  );

  return done;
};

export const getUserSavedTracks = async (refresh_token) => {
  const { access_token } = await getAccessToken(refresh_token);
  const items = [];
  let response = await fetchFromSpotify(access_token, SAVED_TRACKS_ENDPOINT);
  items.push(...response.items);
  while (response.next) {
    response = await fetchFromSpotify(access_token, response.next);
    items.push(...response.items);
  }
  const tracks = items.map((item) => {
    const { track } = item;
    return {
      artist: track.artists.map((_artist) => _artist.name).join(", "),
      id: track.id,
      title: track.name,
      album: track.album.name,
    };
  });
  return tracks;
};
