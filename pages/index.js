import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Container from "../components/Container";
import { useRouter } from "next/router";

library.add(faSpotify, faArrowRightFromBracket);

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/top");
    }
  }, [session]);

  return (
    <Container>
      <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-gray-100">
        Spotify Tools
      </h1>
      <h2 className="font-bold text-xl my-4 md:text-2xl tracking-tight mb-4 text-black dark:text-gray-100">Utilities to get the most from your Spotify account</h2>
      <ul className="list-disc">
        <li>Import & Export Playlists</li>
        <li>Export your saved songs</li>
        <li>View your top played songs/artists</li>
      </ul>
      <h2 className="font-bold text-2xl my-4 md:text-4xl tracking-tight mb-4 text-black dark:text-gray-100">
        Sign In to get started
      </h2>
      <button className="rounded px-4 py-2 bg-green-600 text-white" onClick={() => signIn("spotify")}>
        <FontAwesomeIcon icon="fa-brands fa-spotify" /> Sign In
      </button>
    </Container>
  );
}
