import { ProjectProp } from "@/types";
import { api } from "@/lib/authenticate/server";
import { Project } from "@/components/Project";
export default async function Page() {
  const temp: ProjectProp[] = await (await api()).get("/api/project/").json();
  //   const temp: ProjectProp[] = await resp.json();
  return (
    <>
      <main>
        <section id="container" className="flex gap-4 px-5 pt-2">
          {temp.map((each) => {
            return <Project key={each.id} data={each} />;
          })}
        </section>
      </main>
    </>
  );
}
