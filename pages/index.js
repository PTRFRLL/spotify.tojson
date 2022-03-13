import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Track from "../components/Track";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Container from "../components/Container";
import User from "../components/User";

library.add(faSpotify, faArrowRightFromBracket)


export default function Home() {
  const { data: session, status } = useSession();
  const [tracks, setTracks] = useState([]);

  const getTopTracks = async () => {
    const res = await fetch('/api/tracks');
    const {tracks} = await res.json();
    setTracks(tracks);
  };

  useEffect(() => {
    if(session){
      getTopTracks();
    }
  }, [session])

  if (session) {
    return (
      <Container>
        <User />
        {tracks && tracks.map((track, index) => (
          <Track ranking={index + 1} key={track.songurl} {...track} />
        ))}
      </Container>
    );
  } else {
    return (
      <Container>
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-gray-100">Top Spotify Songs</h1>
        <p>Ever wonder what your top spotify tracks are? Wonder no more...</p>
        <button className="rounded px-4 py-2 bg-green-600 text-white" onClick={() => signIn("spotify")}><FontAwesomeIcon icon="fa-brands fa-spotify" /> Sign in</button>
      </Container>
    );
  }
}
