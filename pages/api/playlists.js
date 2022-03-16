import { getUserPlaylists } from "../../lib/spotify";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  const {
    token: { accessToken },
  } = await getSession({ req });
  const playlists = await getUserPlaylists(accessToken);


  return res.status(200).json({ playlists });
};

export default handler;
