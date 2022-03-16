import { getUserPlaylists } from "../../lib/spotify";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  try {
    const {
      token: { accessToken },
    } = await getSession({ req });
    const playlists = await getUserPlaylists(accessToken);

    return res.status(200).json({ playlists });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export default handler;
