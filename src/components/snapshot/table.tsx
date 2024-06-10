"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import { SnapshotType } from "@/types";
import { useState } from "react";

export function SnapshotTable({ data }: { data: SnapshotType[] }) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableColumn>Date</TableColumn>
          <TableColumn>Version</TableColumn>
          <TableColumn>Total</TableColumn>
          <TableColumn>Passed</TableColumn>
          <TableColumn>Failed</TableColumn>
          <TableColumn>Unverified</TableColumn>
          <TableColumn>TODO</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((each) => {
            return (
              <TableRow key={each.id}>
                <TableCell> {each.date}</TableCell>
                <TableCell> {each.versionName as string} </TableCell>
                <TableCell>
                  {" "}
                  {each.passed.length +
                    each.failed.length +
                    each.unverified.length +
                    each.todo.length}{" "}
                </TableCell>
                <TableCell> {each.passed.length}</TableCell>
                <TableCell> {each.failed.length}</TableCell>
                <TableCell> {each.unverified.length}</TableCell>
                <TableCell> {each.todo.length}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
