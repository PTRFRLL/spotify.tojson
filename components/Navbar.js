import { useRouter } from "next/router";
import ThemeChanger from "./Theme";
import NextLink from "next/link";
import cn from "classnames";
import { useSession, signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NavItem = ({ href, text }) => {
  const router = useRouter();
  const isActive = router.asPath === href;

  return (
    <NextLink href={href}>
      <a
        className={cn(
          isActive ? "font-semibold text-gray-800 dark:text-gray-200" : "font-normal text-gray-600 dark:text-gray-400",
          "hidden md:inline-block p-1 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
        )}
      >
        <span className="capsize">{text}</span>
      </a>
    </NextLink>
  );
};

export default function Navbar() {
  const { data: session, status } = useSession();
  
  return (
    <div className="flex flex-col justify-center px-8">
      <nav className="flex items-center justify-between w-full relative max-w-2xl border-gray-200 dark:border-gray-700 mx-auto pt-8 pb-2 sm:pb-4  text-gray-900 bg-opacity-60 dark:text-gray-100">
        <div className="ml-[-0.60rem]">
          {session && (
            <>
              <NavItem href="/top" text="Top Songs" />
              <NavItem href="/songs" text="Saved Songs" />
              <NavItem href="/playlists" text="Playlists" />
              <button title="Sign Out" className="rounded px-4 py-2 bg-red-600 text-white" onClick={() => signOut()}><FontAwesomeIcon icon="fa-solid fa-arrow-right-from-bracket" /></button>
            </>
          )}
        </div>
        <ThemeChanger />
      </nav>
    </div>
  );
}
