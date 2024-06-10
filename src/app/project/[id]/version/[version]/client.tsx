"use client";

import { useState, useEffect } from "react";
import SnapshotChart from "@/components/snapshot/chart";
import { SnapshotTable } from "@/components/snapshot/table";
import { SnapshotType } from "@/types";
import { Pagination } from "@nextui-org/react";
import { api } from "@/lib/authenticate/bare";

export default function ClientPage({
  initialData,
  totalPages: initialTotalPages,
  id,
  version,
  itemsPerPage,
}: {
  initialData: SnapshotType[];
  totalPages: number;
  id: number;
  version: string;
  itemsPerPage: number;
}) {
  const [data, setData] = useState<SnapshotType[]>(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData(page: number) {
      try {
        const response: {
          results: SnapshotType[];
          count: number;
        } = await api
          .url(
            `/api/frontend/project/${id}/version/${version}/?page=${page}&limit=${itemsPerPage}`
          )
          .get()
          .json();

        setData(response.results);
        setTotalPages(Math.ceil(response.count / itemsPerPage));
        setError(null);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setError("Failed to fetch data");
      }
    }

    if (currentPage !== 1) {
      fetchData(currentPage);
    }
  }, [id, version, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main>
      {error ? <div>{error}</div> : <SnapshotChart data={data} />}
      <div>
        <div className="grid pb-2">
          <Pagination
            className="justify-self-center"
            total={totalPages}
            page={currentPage}
            onChange={handlePageChange}
          />
        </div>
        <SnapshotTable data={data} />
      </div>
    </main>
  );
}
