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
import useSWR from "swr";
import fetcher from "../lib/fetcher";
import Tracks from "../components/Tracks";
import { Audio } from "react-loader-spinner";

library.add(faSpotify, faArrowRightFromBracket);

export default function Top() {
  const { data: session, status } = useSession();
  const [term, setTerm] = useState("long_term");
  const [limit, setLimit] = useState("10");
  const { data, error } = useSWR(`/api/top-tracks?time_range=${term}&limit=${limit}`, fetcher);
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session]);

  return (
    <Container>
      <h1 className="font-bold text-2xl md:text-3xl tracking-tight text-black dark:text-gray-100">Top Songs</h1>
      <div className="flex justify-between items-center w-full relative max-w-2xl border-gray-200 dark:border-gray-700 mx-auto pt-8 pb-2 sm:pb-4  text-gray-900 bg-opacity-60 dark:text-gray-100">
        <div>
          <button className={term === 'short_term' ? "font-semibold border-b border-gray-800 dark:border-gray-100 mx-2" : "mx-2"} onClick={() => {setTerm('short_term')}}>Last 4 Weeks</button>
          <button className={term === 'medium_term' ? "font-semibold border-b border-gray-800 dark:border-gray-100 mx-2" : "mx-2"} onClick={() => {setTerm('medium_term')}}>Last 6 Months</button>
          <button className={term === 'long_term' ? "font-semibold border-b border-gray-800 dark:border-gray-100 mx-2" : "mx-2"} onClick={() => {setTerm('long_term')}}>All Time</button>
        </div>
        <div>
          <span>Limit:  </span>
          <button className={limit === '10' ? "font-semibold border-b border-gray-800 dark:border-gray-100 mx-1" : "mx-1"} onClick={() => {setLimit('10')}}>10</button>
          <button className={limit === '20' ? "font-semibold border-b border-gray-800 dark:border-gray-100 mx-1" : "mx-1"} onClick={() => {setLimit('20')}}>20</button>
          <button className={limit === '50' ? "font-semibold border-b border-gray-800 dark:border-gray-100 mx-1" : "mx-1"} onClick={() => {setLimit('50')}}>50</button>
        </div>
      </div>
      {!data && <>
        <h1>Loading...</h1>
        <Audio height="100" width="100" color="grey" ariaLabel="loading" />
      </>}
      {data && <Tracks tracks={data.tracks} />}
    </Container>
  );
}
