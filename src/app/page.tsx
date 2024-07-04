import { signIn } from "@/actions";

import { auth } from "@/auth";
import Hero from "../../public/hero.svg";
import { Button, ButtonGroup, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { FaDownload, FaMusic, FaSpotify, FaUpload } from "react-icons/fa6";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/top");
  }

  return (
    <main>
      <section className="w-full py-6 md:py-12 lg:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Unlock Your Spotify Data
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Analyze, export and import your Spotify data with ease.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <form action={signIn}>
                  <Button
                    aria-label="Sign in using Spotify"
                    type="submit"
                    className="bg-spoti font-bold"
                    size="lg"
                    startContent={<FaSpotify size={"1.5em"} />}
                  >
                    Sign in using Spotify
                  </Button>
                </form>
              </div>
            </div>
            <Image
              src={Hero}
              width="550"
              height="550"
              alt="Hero"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
            />
          </div>
        </div>
      </section>
      <section className="w-full bg-muted">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl  gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col justify-start space-y-4">
              <div className="flex items-center px-3 py-1 ">
                <FaMusic className="h-4 w-4 mr-4" />
                <h1 className="text-xl">Display</h1>
              </div>
              <h3 className="text-xl font-bold">Visualize Your Data</h3>
              <p className="text-muted-foreground">View your top songs over the last month, 6 months and year</p>
            </div>
            <div className="flex flex-col justify-start space-y-4">
              <div className="flex items-center px-3 py-1 ">
                <FaDownload className="h-4 w-4  mr-4" />
                <h1 className="text-xl">Export</h1>
              </div>
              <h3 className="text-xl font-bold">Export Your Data</h3>
              <p className="text-muted-foreground">
                Download your Spotify playlist and saved tracks as JSON, for safe keeping, to use in your own analysis,
                or to share with others.
              </p>
            </div>
            <div className="flex flex-col justify-start space-y-4">
              <div className="flex items-center px-3 py-1 ">
                <FaUpload className="h-4 w-4  mr-4" />
                <h1 className="text-xl">Import</h1>
              </div>

              <h3 className="text-xl font-bold">Import Playlists</h3>
              <p className="text-muted-foreground">
                Easily import your Spotify playlists into our tool, allowing you to manage and organize your music
                library with ease.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
