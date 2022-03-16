import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Error() {
    return (
      <div className="flex flex-col items-center justify-between h-10 mt-5">
        <FontAwesomeIcon icon="fa-solid fa-bomb" size="6x" />
        <h1 className="font-bold text-2xl md:text-3xl mt-5 tracking-tight text-black dark:text-gray-100">Uh oh...</h1>
        <h1 className="text-xl mt-5">Something went wrong <span>🤦‍♂️</span>. Try reloading the page</h1>
      </div>
    );
  }