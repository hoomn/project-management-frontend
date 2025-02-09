"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ToastContainer } from "react-toastify";

import Icon from "@/components/ui/icon";

import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import ThemeSelector from "./theme-selector";
import Version from "./version";

export default function Header() {
  const { theme, systemTheme } = useTheme();
  const { data: session } = useSession();
  const pathname = usePathname();

  const navLinks = [
    { href: "/projects", label: "Projects" },
    { href: "/tasks", label: "Tasks" },
    { href: "/tasks/me", label: "My Tasks" },
  ];

  return (
    <header>
      <Navbar expand="lg" className="bg-dark-subtle" data-bs-theme="dark" style={{ minHeight: 65 }}>
        <ToastContainer position="top-right" autoClose={10_000} theme={theme === "system" ? systemTheme : theme} />
        <Container>
          <Link href="/" className="navbar-brand">
            PM
          </Link>

          {session && (
            <>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`nav-link${pathname === link.href ? " active" : ""}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Nav>
                <ThemeSelector />
                <Dropdown drop="start">
                  <Dropdown.Toggle className="btn-sm no-toggle-icon p-0" variant="">
                    <div
                      className="d-inline-flex justify-content-center align-items-center bg-light text-dark rounded-circle"
                      style={{ width: 38, height: 38, cursor: "pointer" }}
                    >
                      <span className="font-weight-bold ">{session?.user.initials}</span>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Link key={0} className="dropdown-item" href="/auth/profile">
                      <Icon icon={"person-bounding-box"} />
                      profile
                    </Link>
                    <button key={1} className="dropdown-item" onClick={() => signOut()}>
                      <Icon icon={"power"} />
                      sign out
                    </button>
                    <hr className="dropdown-divider mb-1" />
                    <div className="text-center">
                      <Version />
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              </Navbar.Collapse>
            </>
          )}
        </Container>
      </Navbar>
    </header>
  );
}
