import { getUsersTracks } from "../../lib/spotify";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  const {
    token: { accessToken },
  } = await getSession({ req });
  const { query } = req;
  const response = await getUsersTracks(accessToken, query.time_range, query.limit);
  const { items } = await response.json();

  const tracks = items.map((track) => ({
    artist: track.artists.map((_artist) => _artist.name).join(", "),
    songUrl: track.external_urls.spotify,
    title: track.name,
    image: track.album.images.shift().url,
    previewUrl: track.preview_url,
  }));

  return res.status(200).json({ tracks });
};

export default handler;
