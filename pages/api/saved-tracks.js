import { getUserSavedTracks } from "../../lib/spotify";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  const {
    token: { accessToken },
  } = await getSession({ req });
  const tracks = await getUserSavedTracks(accessToken);


  return res.status(200).json({ tracks });
};

export default handler;
