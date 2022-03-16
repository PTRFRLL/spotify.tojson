import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import Container from "../components/Container";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "../lib/fetcher";
import Tracks from "../components/Tracks";
import { Audio } from "react-loader-spinner";

library.add(faDownload);

export default function Songs() {
  const { data: session, status } = useSession();
  const { data, error } = useSWR(`/api/saved-tracks`, fetcher);
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session]);

  const downloadFile = async () => {
    const fileName = `saved-songs-${+new Date()}`;
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
      <h1 className="font-bold text-2xl md:text-3xl tracking-tight text-black dark:text-gray-100">Saved Songs</h1>
      {!data && !error && (
        <>
          <Audio height="100" width="100" color="grey" ariaLabel="loading" />
          <h1>Loading...</h1>
        </>
      )}
      {error && <p>Something no worky...</p>}
      {data && !error && (
        <>
          <p>Found {data.tracks.length} saved tracks</p>
          <button className="rounded px-4 py-2 mt-2 bg-blue-600 text-white" onClick={() => downloadFile()}>
            <FontAwesomeIcon icon="fa-solid fa-download" /> Download Saved Songs
          </button>
          <Tracks tracks={data.tracks.slice(0, 10)} />{" "}
        </>
      )}
    </Container>
  );
}
