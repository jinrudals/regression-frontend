"use client";

import { useState } from "react";
import { TestcaseType } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Input,
  Button,
  Select,
  SelectItem,
  Checkbox,
} from "@nextui-org/react";
import { api } from "@/lib/authenticate/client";
import { api as internal } from "@/lib/authenticate/bare";
import { Selection } from "@nextui-org/react";
import Cookies from "js-cookie";
import wretch, { Wretch, WretchError } from "wretch";

export function TestCaseTable({ data }: { data: TestcaseType[] }) {
  const [tableData, setTableData] = useState<TestcaseType[]>(data);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<TestcaseType>>({});
  const [initialData, setInitialData] = useState<Partial<TestcaseType>>({});
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const handleEditClick = (id: number) => {
    setEditId(id);
    const itemToEdit = data.find((item) => item.id === id);
    if (itemToEdit) {
      setEditData(itemToEdit);
      setInitialData(itemToEdit);
    }
  };

  const handleSaveClick = async () => {
    const changes = Object.keys(editData).reduce((acc, key) => {
      const newValue = editData[key as keyof TestcaseType];
      const oldValue = initialData[key as keyof TestcaseType];

      if (
        newValue !== oldValue &&
        newValue !== null &&
        newValue !== undefined
      ) {
        (acc as any)[key as keyof TestcaseType] = newValue;
      }
      return acc;
    }, {} as Partial<TestcaseType>);

    if (Object.keys(changes).length > 0) {
      try {
        const response: TestcaseType = await api()
          .url(`/api/testcase/${editId}/`)
          .catcher(401, async (error: WretchError, request: Wretch) => {
            const refreshToken = Cookies.get("refresh");
            const response = await internal.post(
              { refresh: refreshToken },
              "/auth/jwt/refresh"
            );
            const { access } = (await response.json()) as {
              access: string;
            };
            Cookies.set("access", access);
            const temp = await request.auth(`Bearer ${access}`).fetch().json();

            return temp;
          })
          .patch(changes)
          .json();
        setTableData((prevData) =>
          prevData.map((item) => (item.id === editId ? response : item))
        );
      } catch (error) {
        console.error("Error saving data:", error);
      }
    }

    setEditId(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof TestcaseType
  ) => {
    const value =
      field === "timeout" ? parseInt(e.target.value, 10) : e.target.value;
    setEditData({
      ...editData,
      [field]: isNaN(Number(value)) ? initialData.timeout ?? 0 : Number(value),
    });
  };

  const handleStatusChange = (e: any) => {
    setEditData({ ...editData, status: e.target.value as string });
  };

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      const allIds = data.map((item) => item.id);
      setCheckedItems(new Set(allIds));
      setSelectedKeys(new Set(allIds));
    } else {
      setCheckedItems(new Set());
      setSelectedKeys(new Set());
    }
  };

  const handleCheckboxChange = (id: number) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(id)) {
      newCheckedItems.delete(id);
    } else {
      newCheckedItems.add(id);
    }
    setCheckedItems(newCheckedItems);
    setSelectAll(newCheckedItems.size === data.length);
    setSelectedKeys(newCheckedItems);
  };

  const convertSelectionToArray = (selection: Selection): number[] =>
    Array.from(selection).map((key) => Number(key));

  const handleBulkUpdate = async (status: string) => {
    try {
      const response = api()
        .url("/api/testcase/bulk/")
        .catcher(401, async (error: WretchError, request: Wretch) => {
          const refreshToken = Cookies.get("refresh");
          const response = internal.post(
            { refresh: refreshToken },
            "/auth/jwt/refresh"
          );
          const { access } = (await response.json()) as {
            access: string;
          };
          Cookies.set("access", access);
          const temp = request.auth(`Bearer ${access}`).fetch();
          return temp.json();
        })
        .patch({
          status,
          ids: convertSelectionToArray(selectedKeys),
        });
      const data: TestcaseType[] = await response.json();
      setTableData((prevData) =>
        prevData.map(
          (item) =>
            data.find(
              (updatedItem: TestcaseType) => updatedItem.id === item.id
            ) || item
        )
      );
      data;
    } catch (error) {
      console.error("Error updating bulk status:", error);
    }
  };

  return (
    <>
      <div className="flex gap-4 justify-center py-2">
        <Button onClick={() => handleBulkUpdate("candidate")}>
          To Candidate
        </Button>
        <Button onClick={() => handleBulkUpdate("candidate2")}>
          To Candidate2
        </Button>
        <Button onClick={() => handleBulkUpdate("todo")}>To Todo</Button>
      </div>
      <Table
        aria-label="Test Cases Table"
        onSelectionChange={(keys: Selection) => setSelectedKeys(keys)}
      >
        <TableHeader>
          <TableColumn>
            <Checkbox isSelected={selectAll} onChange={handleSelectAllChange}>
              All
            </Checkbox>
          </TableColumn>
          <TableColumn>ID</TableColumn>
          <TableColumn>Key</TableColumn>
          <TableColumn>Group</TableColumn>
          <TableColumn>Command</TableColumn>
          <TableColumn>Timeout</TableColumn>
          <TableColumn>Owner</TableColumn>
          <TableColumn style={{ minWidth: "150px" }}>Status</TableColumn>
          <TableColumn>{""}</TableColumn>
        </TableHeader>
        <TableBody>
          {tableData.map((each) => {
            const isEditing = editId === each.id;
            return (
              <TableRow key={each.id}>
                <TableCell>
                  <Checkbox
                    isSelected={checkedItems.has(each.id)}
                    onChange={() => handleCheckboxChange(each.id)}
                  />
                </TableCell>
                <TableCell>{each.id}</TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      value={editData.key ?? ""}
                      onChange={(e) => handleChange(e, "key")}
                    />
                  ) : (
                    each.key
                  )}
                </TableCell>
                <TableCell>{each.group}</TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      value={editData.command ?? ""}
                      onChange={(e) => handleChange(e, "command")}
                    />
                  ) : (
                    each.command
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={`${editData.timeout ?? 0}`}
                      onChange={(e) => handleChange(e, "timeout")}
                    />
                  ) : each.timeout === -1 ? (
                    "infinite"
                  ) : (
                    each.timeout
                  )}
                </TableCell>
                <TableCell>{each.email}</TableCell>
                <TableCell style={{ minWidth: "150px" }}>
                  {isEditing ? (
                    <Select
                      aria-label="Status"
                      defaultSelectedKeys={[`${editData.status}`]}
                      onChange={handleStatusChange}
                      disabledKeys={["passed", "failed"]}
                    >
                      <SelectItem key="candidate" value="candidate">
                        candidate
                      </SelectItem>
                      <SelectItem key="candidate2" value="candidate2">
                        candidate2
                      </SelectItem>
                      <SelectItem key="todo" value="todo">
                        todo
                      </SelectItem>
                      <SelectItem key="passed" value="passed">
                        pass
                      </SelectItem>
                      <SelectItem key="failed" value="fail">
                        fail
                      </SelectItem>
                    </Select>
                  ) : (
                    each.status
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Button onClick={handleSaveClick}>Save</Button>
                  ) : (
                    <Button onClick={() => handleEditClick(each.id)}>
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
