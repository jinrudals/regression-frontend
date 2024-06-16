import { Link } from "@nextui-org/react";

export default async function Home() {
  return (
    <>
      <main className="flex justify-center items-center h-screen">
        <section id="container" className="flex flex-col gap-4 px-5 pt-2">
          <div id="block" className="flex flex-col items-center">
            <div id="content" className="text-center">
              This is the main page for regression.
            </div>
            <Link href="/dv/regression/project">Project</Link>
          </div>
        </section>
      </main>
    </>
  );
}
