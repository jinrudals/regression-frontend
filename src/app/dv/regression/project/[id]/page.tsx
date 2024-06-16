import { api } from "@/lib/authenticate/bare";
import { VersionType } from "@/types";
import Version from "@/components/Versions";

export default async function Page({
  params: { id },
}: {
  params: { id: number };
}) {
  const response = api.get(`/api/frontend/project/${id}`);
  const data: VersionType[] = await response.json();
  const temp: VersionType = {
    id: -1,
    name: "all",
    project: id,
  };

  const t1 = [temp, ...data];
  return (
    <main>
      <section id="container" className="flex gap-4 px-5 pt-2">
        {t1.map((each) => {
          return <Version key={each.id} data={each} />;
        })}
      </section>
    </main>
  );
}
