"use client";

import { useTheme } from "next-themes";

import Icon from "@/components/ui/icon";

import Dropdown from "react-bootstrap/Dropdown";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <Dropdown drop="start">
      <Dropdown.Toggle className="btn-sm no-toggle-icon fs-4 p-1 me-2 text-secondary" variant="" title="Theme selector">
        <Icon me={0} icon={theme === "light" ? "sun-fill" : theme === "dark" ? "moon-stars-fill" : "laptop"} />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item active={theme === "light"} onClick={() => setTheme("light")}>
          <Icon icon="sun-fill" />
          Light
        </Dropdown.Item>
        <Dropdown.Item active={theme === "dark"} onClick={() => setTheme("dark")}>
          <Icon icon="moon-stars-fill" />
          Dark
        </Dropdown.Item>
        <Dropdown.Item active={theme === "system"} onClick={() => setTheme("system")}>
          <Icon icon="laptop" />
          System
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
