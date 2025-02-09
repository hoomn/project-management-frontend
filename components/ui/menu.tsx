"use cleint";

import { MouseEventHandler, ReactNode } from "react";

import Link from "next/link";

import Dropdown from "react-bootstrap/Dropdown";

export type MenuItem = {
  icon?: ReactNode;
  name: string;
  url?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
};

type MenuProps = {
  items: MenuItem[];
};

export default function Menu({ items }: MenuProps) {
  return (
    <Dropdown>
      <Dropdown.Toggle className="btn-sm no-toggle-icon" variant="">
        <i className="bi bi-three-dots"></i>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {items.map((item, i) => (
          <Link
            key={i}
            className="dropdown-item"
            href={item.url ? item.url : "#"}
            onClick={item.onClick ? item.onClick : undefined}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
