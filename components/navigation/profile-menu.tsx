import { signOut } from "next-auth/react";
import Link from "next/link";

import Icon from "@/components/ui/icon";

import Dropdown from "react-bootstrap/Dropdown";

import Version from "./version";

export default function ProfileMenu({ initials }: { initials: string }) {
  return (
    <Dropdown drop="start">
      <Dropdown.Toggle className="btn-sm no-toggle-icon p-0" variant="">
        <div
          className="d-inline-flex justify-content-center align-items-center bg-light text-dark rounded-circle"
          style={{ width: 38, height: 38, cursor: "pointer" }}
        >
          <span className="font-weight-bold ">{initials}</span>
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Link className="dropdown-item" href="/auth/profile">
          <Icon icon={"person-bounding-box"} />
          profile
        </Link>
        <button className="dropdown-item" onClick={() => signOut()}>
          <Icon icon={"power"} />
          sign out
        </button>
        <hr className="dropdown-divider mb-1" />
        <div className="text-center">
          <Version />
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}
