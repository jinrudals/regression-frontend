"use client";

import { api } from "@/lib/authenticate/bare";
import { TestCaseTable } from "@/components/testcase/Table";
import { TestcaseType } from "@/types";
import { Input, Pagination } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { TestcaseModal } from "@/components/testcase/Modal";

export function Client({
  initialData,
  totalPages: initialTotalPages,
  id,
  itemsPerPage,
}: {
  initialData: TestcaseType[];
  totalPages: number;
  id: number;
  itemsPerPage: number;
}) {
  const [data, setData] = useState<TestcaseType[]>(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [appliedQuery, setAppliedQuery] = useState<string>("");

  useEffect(() => {
    async function fetchData(page: number, query: string) {
      try {
        const url = query
          ? `/api/frontend/project/${id}/testcases/?page=${page}&limit=${itemsPerPage}&query=${query}`
          : `/api/frontend/project/${id}/testcases/?page=${page}&limit=${itemsPerPage}`;
        const response: {
          results: TestcaseType[];
          count: number;
        } = await api.url(url).get().json();

        setData(response.results);
        setTotalPages(Math.ceil(response.count / itemsPerPage));
        setError(null);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setError("Failed to fetch data");
      }
    }
    fetchData(currentPage, appliedQuery);
  }, [id, currentPage, itemsPerPage, appliedQuery]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };
  const handleQuerySubmit = () => {
    setCurrentPage(1);
    setAppliedQuery(query);
  };
  return (
    <>
      <main>
        <div className="grid pb-2">
          <div className="justify-self-center justify-content-center">
            <TestcaseModal project={id} />
            <div className="flex gap-2">
              <Input
                type="text"
                value={query}
                onChange={handleQueryChange}
                placeholder={"Query Here"}
              />
              <button onClick={handleQuerySubmit}> Hit</button>
            </div>
          </div>
          <TestCaseTable data={data} />
          <Pagination
            className="justify-self-center"
            total={totalPages}
            page={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </main>
    </>
  );
}
