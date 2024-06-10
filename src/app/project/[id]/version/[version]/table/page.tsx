import { api } from "@/lib/authenticate/bare";
import { TestcaseType } from "@/types";
import { Client } from "./client";

export default async function Page({
  params: { id, version },
}: {
  params: {
    id: number;
    version: string;
  };
}) {
  const itemsPerPage = 10;
  const response: {
    results: TestcaseType[];
    count: number;
  } = await api.url(`/api/frontend/project/${id}/testcases/`).get().json();
  console.log(response.results);
  const totalPages = Math.ceil(response.count / itemsPerPage);
  return (
    <>
      <main>
        <div className="grid">
          <div className="justify-self-center font-bold">
            Project Testcase Status Table
          </div>
        </div>

        <Client
          initialData={response.results}
          totalPages={totalPages}
          id={id}
          itemsPerPage={itemsPerPage}
        />
      </main>
    </>
  );
}
