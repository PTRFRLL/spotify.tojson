export const maxDuration = 60;
import { SpotifyTask } from "@/actions/SpotifyTask";
import { auth } from "@/auth";

const encoder = new TextEncoder();
const encodeData = (data: any) => {
  return encoder.encode(`data: ${JSON.stringify(data)} \n\n`);
};

export async function GET() {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const task = new SpotifyTask();
  task.on("progress", ({ progress }) => {
    writer.write(encodeData({ progress, status: "running" }));
  });

  task.on("end", ({ data }) => {
    writer.write(encodeData({ data, progress: 100, status: "done" }));
    writer.close();
  });

  task.on("start", () => {
    writer.write(encodeData({ progress: 0, status: "start" }));
  });

  setImmediate(() => {
    task.fetchSavedTracks();
  });

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
