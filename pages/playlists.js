import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Container from "../components/Container";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Audio } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fetcher from "../lib/fetcher";
import Playlist from "../components/Playlist";
import Loader from "../components/Loader";
import Error from "../components/Error";

export default function Playlists() {
  const { data: session, status } = useSession();
  const { data, error } = useSWR(`/api/playlists`, fetcher);
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session]);

  const downloadFile = async () => {
    const fileName = `playlists-${+new Date()}`;
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container>
      <h1 className="font-bold text-2xl md:text-3xl tracking-tight text-black dark:text-gray-100">Playlists</h1>
      {!data && !error && <Loader />}
      {error && <Error />}
      {data && (
        <>
          <p>Found {data.playlists.length} playlists</p>
          <button className="rounded px-4 py-2 mt-2 bg-blue-600 text-white" onClick={() => downloadFile()}>
            <FontAwesomeIcon icon="fa-solid fa-download" /> Download Playlists
          </button>
          {/* <Tracks tracks={data.tracks.slice(0, 10)} />{" "} */}
          {data.playlists.map((playlist, index) => (
            <Playlist {...playlist} ranking={index + 1} key={playlist.id} />
          ))}
        </>
      )}
    </Container>
  );
}
