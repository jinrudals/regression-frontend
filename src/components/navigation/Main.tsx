import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { auth, signIn, signOut } from "@/auth";

export default async function Navigation({ name = "main" }: { name: string }) {
  const session = await auth();
  return (
    <Navbar id={name}>
      <NavbarBrand>
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          {session?.user ? (
            <Link href="/api/auth/signout"> Logout </Link>
          ) : (
            <Link href="/api/auth/signin">Login</Link>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
