"use client";
import { Button, Progress, Tooltip } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa6";

const endpointMap = {
  playlists: "/api/export/playlists",
  tracks: "/api/export/saved",
};

type Props = {
  left: React.ReactNode;
  count: number;
  endpoint: "playlists" | "tracks";
};

export default function DownloadButton({ count, left, endpoint }: Props) {
  const [data, setData] = useState(null);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);

  const dateString = () => {
    let date = new Date();
    return date.toISOString().split("T")[0];
  };

  const downloadFile = async (items: any[]) => {
    const fileName = `${dateString()}-${endpoint}`;
    const json = JSON.stringify(items);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (!running) return;

    const eventSource = new EventSource(endpointMap[endpoint]);

    eventSource.onmessage = (evt) => {
      if (!evt.data) return;
      const data = JSON.parse(evt.data);
      setProgress(data.progress);
      if (data.status === "done") {
        setData(data.data);
        setRunning(false);
        eventSource.close();
        downloadFile(data.data);
      }
    };

    eventSource.onerror = () => {
      console.error("Something happened");
      eventSource.close();
      setError(true);
    };

    return () => {
      eventSource.close();
    };
  }, [running]);

  const handleStartTask = () => {
    setRunning(true); // Trigger the effect to start the task
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
              variant="bordered"
              isDisabled={running}
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
        {progress > 0 && <Progress size="sm" color={color()} value={progress} aria-label="Loading" />}
      </div>
    </div>
  );
}
