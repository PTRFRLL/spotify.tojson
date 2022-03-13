import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut, useSession } from "next-auth/react";

export default function User(user) {
    const { data: session, status } = useSession();
    return (
      <div>
        <p>Signed in as {session?.token?.email}</p>
        <button className="rounded px-4 py-2 bg-red-600 text-white" onClick={() => signOut()}><FontAwesomeIcon icon="fa-solid fa-arrow-right-from-bracket" /> Sign out</button>
      </div>
    );
  }