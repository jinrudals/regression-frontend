"use client";
import { Link } from "@nextui-org/react";
import { usePathname } from "next/navigation";
export function MyTable() {
  const currentPath = usePathname();
  return (
    <Link color="foreground" href={`${currentPath}/table`}>
      Table
    </Link>
  );
}
