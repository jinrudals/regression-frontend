import { api } from "@/lib/authenticate/bare";
import ClientPage from "./client";
import { SnapshotType } from "@/types";

async function fetchData(
  id: number,
  version: string,
  page: number,
  itemsPerPage: number
) {
  const response: {
    results: SnapshotType[];
    count: number;
  } = await api
    .url(
      `/api/frontend/project/${id}/version/${version}/?page=${page}&limit=${itemsPerPage}`
    )
    .get()
    .json();
  return response;
}

export default async function Page({
  params: { id, version },
}: {
  params: {
    id: number;
    version: string;
  };
}) {
  const itemsPerPage = 10;
  const { results, count } = await fetchData(id, version, 1, itemsPerPage);
  const totalPages = Math.ceil(count / itemsPerPage);

  return (
    <ClientPage
      initialData={results}
      totalPages={totalPages}
      id={id}
      version={version}
      itemsPerPage={itemsPerPage}
    />
  );
}
