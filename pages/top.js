import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Track from "../components/Track";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library, config } from "@fortawesome/fontawesome-svg-core";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Container from "../components/Container";
import User from "../components/User";
import { useRouter } from "next/router";

library.add(faSpotify, faArrowRightFromBracket)


export default function Top() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tracks, setTracks] = useState([]);

  const getTopTracks = async () => {
    const res = await fetch('/api/tracks');
    const {tracks} = await res.json();
    setTracks(tracks);
  };

  useEffect(() => {
    if(session){
      getTopTracks();
    }else{
        router.push('/')
    }
  }, [session])

    return (
      <Container>
        {tracks && tracks.map((track, index) => (
          <Track ranking={index + 1} key={track.songurl} {...track} />
        ))}
      </Container>
    );
}
