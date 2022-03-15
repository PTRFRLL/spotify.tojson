import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Container from "../components/Container";
import { useRouter } from "next/router";


export default function Songs() {
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
      //getTopTracks();
    }else{
        router.push('/')
    }
  }, [session])

    return (
      <Container>
          <h1>Saved Songs</h1>
      </Container>
    );
}
