"use client";

import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ToastContainer } from "react-toastify";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import ProfileMenu from "./profile-menu";
import ThemeSelector from "./theme-selector";

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
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {session &&
                navLinks.map((link) => (
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
            {session && <ProfileMenu initials={session.user.initials} />}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
