export default function Playlist(playlist) {
  return (
    <div className="flex flex-row items-baseline border-b border-gray-200 dark:border-gray-800 max-w-3xl w-full mt-8">
      <p className="text-sm font-bold text-gray-400 dark:text-gray-600">{playlist.ranking}</p>
      <div className="flex flex-col pl-3">
        <a
          className="font-medium text-gray-900 dark:text-gray-100 truncate w-60 sm:w-96 md:w-full"
          href={playlist.songUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {playlist.title}
        </a>
        <p className="text-gray-500 mb-4 truncate w-60 sm:w-96 md:w-full" color="gray.500">
          {playlist.tracks.length} songs
        </p>
      </div>
    </div>
  );
}
