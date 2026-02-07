"use client";
import { Button, Progress, Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { FaDownload } from "react-icons/fa6";
import { useSpotifyClient } from "@/hooks/useSpotifyClient";

type Props = {
  left: React.ReactNode;
  count: number;
  endpoint: "playlists" | "tracks" | "top";
  term?: string; // For top tracks: short_term, medium_term, long_term
};

export default function DownloadButton({ count, left, endpoint, term }: Props) {
  const { client } = useSpotifyClient();
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const dateString = () => {
    let date = new Date();
    return date.toISOString().split("T")[0];
  };

  const downloadFile = (items: any[]) => {
    const termSuffix = endpoint === "top" && term ? `-${term}` : "";
    const fileName = `${dateString()}-${endpoint}${termSuffix}`;
    const json = JSON.stringify(items, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const handleStartTask = async () => {
    if (!client) {
      setError(true);
      setErrorMessage("Not authenticated");
      return;
    }

    try {
      setRunning(true);
      setProgress(0);
      setError(false);
      setErrorMessage("");

      let data: any[];

      if (endpoint === "playlists") {
        // Fetch all playlists with their tracks
        data = await client.fetchAllPlaylistsWithTracks((progressValue) => {
          setProgress(progressValue);
        });
      } else if (endpoint === "tracks") {
        // Fetch all saved tracks
        data = await client.fetchAllSavedTracks((progressValue) => {
          setProgress(progressValue);
        });
      } else if (endpoint === "top") {
        // Fetch top tracks for the specified term
        setProgress(50);
        const { tracks } = await client.fetchTopTracks(term || "short_term");
        data = tracks;
      } else {
        throw new Error("Invalid endpoint");
      }

      // Set progress to 100% before download
      setProgress(100);

      // Download the file
      downloadFile(data);
    } catch (err) {
      console.error("Error during export:", err);
      setError(true);
      setErrorMessage(err instanceof Error ? err.message : "Export failed");
    } finally {
      setRunning(false);
    }
  };

  const color = () => {
    if (error) {
      return "danger";
    } else if (progress >= 100) {
      return "success";
    }
    return "primary";
  };

  return (
    <div>
      <div className="flex flex-row gap-2 justify-between items-center">
        {left && <div>{left}</div>}
        <div>
          <Tooltip content="This can take some time, please be patient">
            <Button
              aria-label="Download"
              variant="bordered"
              isDisabled={running || !client}
              isLoading={running && !error}
              onPress={handleStartTask}
              startContent={running ? null : <FaDownload />}
            >
              {running ? `Downloading ${count}` : "Download JSON"}
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="my-2">
        {progress > 0 && !error && (
          <Progress size="sm" color={color()} value={progress} aria-label="Loading" />
        )}
        {error && (
          <div className="text-red-500 text-sm mt-2">
            <p>Error: {errorMessage}</p>
            <button
              onClick={() => {
                setError(false);
                setProgress(0);
              }}
              className="underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
